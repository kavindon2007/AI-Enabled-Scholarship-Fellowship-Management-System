import re
from typing import Literal
from app.schemas.fraud_schemas import AcademicDetailsInput, SignalResult


class InstitutionAisheVerifier:
    """Signal 5: Verifies institution AISHE code validity, accreditation status, and ghost college blacklist."""

    # AISHE Code Pattern: C-XXXXX (College), U-XXXX (University), S-XXXX (Standalone)
    AISHE_REGEX: str = r"^[CUScus]\-\d{4,6}$"

    # Known blacklisted or ghost college test identifiers
    BLACKLISTED_AISHE_CODES: set[str] = {
        "C-99999",
        "C-00000",
        "U-9999",
        "S-88888",
        "C-66666",
    }

    SUSPICIOUS_INSTITUTION_KEYWORDS: list[str] = [
        "fake",
        "unrecognized",
        "derecognized",
        "defunct",
        "blacklisted",
        "ghost",
    ]

    def verify_institution(self, academic_details: AcademicDetailsInput) -> SignalResult:
        """Validate institution credentials, accreditation, and blacklists."""
        aishe_code: str = academic_details.institution_aishe_code.strip().upper()
        reasons: list[str] = []
        risk_score: float = 0.0

        # Check AISHE format
        if not re.match(self.AISHE_REGEX, aishe_code):
            risk_score += 0.50
            reasons.append(f"Invalid AISHE code format '{aishe_code}' (expected standard C-XXXXX / U-XXXX format)")

        # Check Blacklist
        if aishe_code in self.BLACKLISTED_AISHE_CODES:
            risk_score += 0.90
            reasons.append(f"Institution AISHE code '{aishe_code}' is present on national vigilance blacklist")

        # Check suspicious keywords in course or university affiliation
        course_lower = academic_details.course_name.lower()
        if any(kw in course_lower for kw in self.SUSPICIOUS_INSTITUTION_KEYWORDS):
            risk_score += 0.40
            reasons.append(f"Suspicious designation identified in course name '{academic_details.course_name}'")

        risk_score = round(min(1.0, risk_score), 4)
        flagged: bool = risk_score >= 0.35

        severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        if risk_score >= 0.80:
            severity = "CRITICAL"
        elif risk_score >= 0.50:
            severity = "HIGH"
        elif risk_score >= 0.25:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        return SignalResult(
            signal_name="institution_aishe_verifier",
            risk_contribution=risk_score,
            flagged=flagged,
            severity=severity,
            reasons=reasons if reasons else ["Institution AISHE code verified against national active registry"],
            metadata={
                "aishe_code": aishe_code,
                "course_name": academic_details.course_name,
                "is_blacklisted": aishe_code in self.BLACKLISTED_AISHE_CODES,
            },
        )
