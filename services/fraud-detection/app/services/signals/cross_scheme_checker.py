from typing import Literal
from uuid import UUID
from app.schemas.fraud_schemas import SignalResult


class CrossSchemeChecker:
    """Signal 3: Detects concurrent active scholarships or conflicting dual-benefit claims across schemes."""

    # Mutually exclusive scholarship categories that cannot be availed simultaneously
    MUTUALLY_EXCLUSIVE_PREFIXES: list[str] = [
        "NSP_",
        "PMSSS_",
        "AICTE_PRAGATI_",
        "AICTE_SAKSHAM_",
        "POST_MATRIC_SC_",
        "POST_MATRIC_ST_",
        "POST_MATRIC_OBC_",
        "CENTRAL_SECTOR_",
    ]

    def check_conflicts(
        self,
        applicant_id: UUID,
        current_scheme_code: str,
        academic_year: str,
        existing_active_scholarships: list[dict[str, str | UUID]] | None = None,
    ) -> SignalResult:
        """Analyze existing scholarship registrations for double dipping or duplicate claims."""
        active_scholarships = existing_active_scholarships or []
        conflicting_count: int = 0
        reasons: list[str] = []

        for item in active_scholarships:
            other_scheme: str = str(item.get("scheme_code", ""))
            other_year: str = str(item.get("academic_year", ""))
            other_status: str = str(item.get("status", "ACTIVE")).upper()

            # Ignore completed or cancelled historical records from prior years
            if other_year != academic_year and other_status in ["COMPLETED", "REJECTED"]:
                continue

            # Exact same scheme in same academic year => duplicate application
            if other_scheme == current_scheme_code and other_year == academic_year:
                conflicting_count += 2
                reasons.append(
                    f"Duplicate application for scheme {current_scheme_code} in academic year {academic_year}"
                )
                continue

            # Conflicting central/state scholarship in same academic year
            is_exclusive: bool = any(
                current_scheme_code.startswith(prefix) and other_scheme.startswith(prefix)
                for prefix in self.MUTUALLY_EXCLUSIVE_PREFIXES
            ) or (other_year == academic_year and other_status in ["ACTIVE", "DISBURSED", "APPROVED"])

            if is_exclusive:
                conflicting_count += 1
                reasons.append(
                    f"Concurrent benefit clash: Active award in scheme '{other_scheme}' for academic year '{other_year}'"
                )

        if conflicting_count == 0:
            risk_score: float = 0.0
            severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = "LOW"
            flagged: bool = False
            reasons = ["No duplicate or mutually exclusive active scholarship benefits detected"]
        elif conflicting_count == 1:
            risk_score = 0.70
            severity = "HIGH"
            flagged = True
        else:
            risk_score = 0.95
            severity = "CRITICAL"
            flagged = True

        return SignalResult(
            signal_name="cross_scheme_checker",
            risk_contribution=round(risk_score, 4),
            flagged=flagged,
            severity=severity,
            reasons=reasons,
            metadata={
                "current_scheme": current_scheme_code,
                "academic_year": academic_year,
                "conflicting_records_count": conflicting_count,
            },
        )
