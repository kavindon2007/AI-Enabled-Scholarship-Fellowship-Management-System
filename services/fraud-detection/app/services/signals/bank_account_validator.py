import re
from typing import Literal
from uuid import UUID
from app.schemas.fraud_schemas import BankAccountInput, SignalResult


class BankAccountValidator:
    """Signal 6: Validates bank account authenticity, IFSC structure, Aadhaar seeding, and account clustering."""

    IFSC_REGEX: str = r"^[A-Za-z]{4}0[A-Za-z0-9]{6}$"
    CLUSTER_ALERT_THRESHOLD: int = 2

    def validate(
        self,
        applicant_id: UUID,
        bank_account: BankAccountInput,
        known_account_clusters: dict[str, list[UUID]] | None = None,
    ) -> SignalResult:
        """Evaluate bank account validity, DBT eligibility, and shared account clustering."""
        reasons: list[str] = []
        risk_score: float = 0.0

        # Validate IFSC code format
        if not re.match(self.IFSC_REGEX, bank_account.ifsc_code.strip()):
            risk_score += 0.40
            reasons.append(f"Invalid IFSC code format '{bank_account.ifsc_code}'")

        # Check Aadhaar Seeding
        if not bank_account.aadhaar_seeded:
            risk_score += 0.35
            reasons.append("Bank account is NOT Aadhaar-seeded; ineligible for DBT mandate")

        # Check DBT status
        if not bank_account.dbt_enabled:
            risk_score += 0.25
            reasons.append("Bank account is not DBT-enabled at NPCI mapper")

        # Account clustering check (Ghost accounts or middlemen siphon schemes)
        clusters = known_account_clusters or {}
        associated_applicants = clusters.get(bank_account.account_number_hash, [])
        other_applicants = [uid for uid in associated_applicants if uid != applicant_id]

        if len(other_applicants) >= self.CLUSTER_ALERT_THRESHOLD:
            clustering_penalty = min(0.60, 0.20 * len(other_applicants))
            risk_score += clustering_penalty
            reasons.append(
                f"Bank account cluster alert: Account hash shared with {len(other_applicants)} other applicant(s)"
            )

        risk_score = round(min(1.0, risk_score), 4)
        flagged: bool = risk_score >= 0.30

        severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        if risk_score >= 0.75:
            severity = "CRITICAL"
        elif risk_score >= 0.50:
            severity = "HIGH"
        elif risk_score >= 0.25:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        return SignalResult(
            signal_name="bank_account_validator",
            risk_contribution=risk_score,
            flagged=flagged,
            severity=severity,
            reasons=reasons if reasons else ["Bank account valid, DBT enabled, and correctly seeded with Aadhaar"],
            metadata={
                "ifsc_code": bank_account.ifsc_code,
                "aadhaar_seeded": bank_account.aadhaar_seeded,
                "dbt_enabled": bank_account.dbt_enabled,
                "cluster_size": len(other_applicants) + 1,
            },
        )
