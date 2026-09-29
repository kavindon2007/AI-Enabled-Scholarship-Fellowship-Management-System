from typing import Literal
from app.schemas.fraud_schemas import AcademicDetailsInput, SignalResult


class AcademicMeritVerifier:
    """Signal 7: Checks academic score plausibility, attendance correlation, and roll number anomalies."""

    MIN_ACCEPTABLE_ATTENDANCE: float = 60.0

    def verify_merit(self, academic_details: AcademicDetailsInput) -> SignalResult:
        """Evaluate academic records for tampering indicators and merit contradictions."""
        reasons: list[str] = []
        risk_score: float = 0.0

        # Anomaly: Sub-threshold attendance with high declared merit
        if (
            academic_details.attendance_percentage < self.MIN_ACCEPTABLE_ATTENDANCE
            and academic_details.marks_percentage > 85.0
        ):
            risk_score += 0.35
            reasons.append(
                f"Statistical anomaly: Claimed {academic_details.marks_percentage}% marks despite sub-minimum attendance ({academic_details.attendance_percentage}%)"
            )

        # Anomaly: Impossible or suspicious marks
        if academic_details.marks_percentage > 99.5:
            risk_score += 0.15
            reasons.append("Unusual extreme ceiling marks (99.5%+) flagged for physical marksheet verification")

        # Roll number format check
        roll_num = academic_details.roll_number.strip()
        if len(roll_num) < 3 or roll_num.isdigit() and len(roll_num) > 16:
            risk_score += 0.25
            reasons.append(f"Suspicious roll number format or length '{roll_num}'")

        # Current year of study check
        if academic_details.current_year_of_study <= 0 or academic_details.current_year_of_study > 6:
            risk_score += 0.30
            reasons.append(f"Invalid academic year of study: {academic_details.current_year_of_study}")

        risk_score = round(min(1.0, risk_score), 4)
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
            signal_name="academic_merit_verifier",
            risk_contribution=risk_score,
            flagged=flagged,
            severity=severity,
            reasons=reasons if reasons else ["Academic merit and attendance profile verified"],
            metadata={
                "marks_percentage": academic_details.marks_percentage,
                "attendance_percentage": academic_details.attendance_percentage,
                "current_year": academic_details.current_year_of_study,
                "roll_number": academic_details.roll_number,
            },
        )
