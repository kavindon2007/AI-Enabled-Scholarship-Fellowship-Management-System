from typing import Literal
from app.schemas.fraud_schemas import IncomeFamilyInput, SignalResult


class IncomeAnomalyDetector:
    """Signal 4: Detects discrepancies between declared income, ration card category, ITR status, and assets."""

    BPL_INCOME_CEILING_INR: float = 250000.0
    AAY_INCOME_CEILING_INR: float = 120000.0
    PER_CAPITA_MIN_SUBSISTENCE_INR: float = 12000.0

    def evaluate_income(self, income_data: IncomeFamilyInput) -> SignalResult:
        """Analyze income parameters for economic contradictions and under-declaration anomalies."""
        reasons: list[str] = []
        anomaly_points: float = 0.0

        per_capita_income = income_data.annual_income / max(1, income_data.family_members_count)

        # Contradiction: AAY (Antyodaya Anna Yojana) with high declared income
        if income_data.ration_card_type == "AAY" and income_data.annual_income > self.AAY_INCOME_CEILING_INR:
            anomaly_points += 0.40
            reasons.append(
                f"Income INR {income_data.annual_income:,.0f} exceeds Antyodaya (AAY) ceiling of INR {self.AAY_INCOME_CEILING_INR:,.0f}"
            )

        # Contradiction: BPL card with high declared income
        if income_data.ration_card_type == "BPL" and income_data.annual_income > self.BPL_INCOME_CEILING_INR:
            anomaly_points += 0.35
            reasons.append(
                f"Income INR {income_data.annual_income:,.0f} conflicts with BPL classification (limit INR {self.BPL_INCOME_CEILING_INR:,.0f})"
            )

        # Contradiction: ITR filed but declared income below tax threshold (< INR 2,50,000) while owning significant land
        if income_data.itr_filed and income_data.annual_income < 100000.0:
            anomaly_points += 0.25
            reasons.append("ITR filed status conflicts with claimed extreme poverty annual income (< INR 100,000)")

        # Contradiction: Large agricultural landholding declared alongside near-zero income
        if income_data.declared_agriculture_land_acres > 5.0 and income_data.annual_income < 80000.0:
            anomaly_points += 0.30
            reasons.append(
                f"Significant landholding ({income_data.declared_agriculture_land_acres} acres) with implausibly low declared income"
            )

        # Per-capita subsistence check: Earning members > 1 but total declared income under minimum wage
        if income_data.earning_members_count >= 2 and income_data.annual_income < 50000.0:
            anomaly_points += 0.20
            reasons.append(
                f"Multiple earning members ({income_data.earning_members_count}) with aggregate income under INR 50,000"
            )

        risk_score: float = round(min(1.0, anomaly_points), 4)
        flagged: bool = risk_score >= 0.30

        severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        if risk_score >= 0.70:
            severity = "CRITICAL"
        elif risk_score >= 0.45:
            severity = "HIGH"
        elif risk_score >= 0.20:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        return SignalResult(
            signal_name="income_anomaly_detector",
            risk_contribution=risk_score,
            flagged=flagged,
            severity=severity,
            reasons=reasons if reasons else ["Income parameters consistent with ration card and asset declarations"],
            metadata={
                "annual_income": income_data.annual_income,
                "per_capita_income": round(per_capita_income, 2),
                "ration_card_type": income_data.ration_card_type,
                "itr_filed": income_data.itr_filed,
            },
        )
