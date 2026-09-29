import re
from typing import Literal
from app.schemas.fraud_schemas import CertificateDocument, SignalResult


class AuthorityVerifier:
    """Signal 1: Verifies issuing authority legitimacy, digital signatures, and certificate formatting."""

    RECOGNIZED_AUTHORITY_PATTERNS: list[str] = [
        r"tahsildar",
        r"tehsildar",
        r"sub[\s\-]?divisional\s+magistrate",
        r"sdm",
        r"district\s+magistrate",
        r"revenue\s+officer",
        r"competent\s+authority",
        r"circle\s+officer",
        r"headmaster",
        r"principal",
        r"registrar",
    ]

    def verify(self, documents: list[CertificateDocument]) -> SignalResult:
        """Evaluate issuing authority validity, signatures, and QR codes across all submitted documents."""
        if not documents:
            return SignalResult(
                signal_name="authority_verifier",
                risk_contribution=0.8,
                flagged=True,
                severity="HIGH",
                reasons=["No supporting certificates provided for authority verification"],
                metadata={"total_docs": 0, "missing_signatures": 0, "unverified_qr": 0},
            )

        total_docs: int = len(documents)
        missing_signatures: int = 0
        unverified_qr: int = 0
        suspicious_authorities: int = 0
        reasons: list[str] = []

        for doc in documents:
            # Check Digital Signature
            if not doc.digital_signature_present:
                missing_signatures += 1
                reasons.append(f"Digital signature missing on {doc.doc_type} certificate ({doc.certificate_number})")

            # Check QR Code Verification
            if not doc.qr_code_verified:
                unverified_qr += 1
                reasons.append(f"QR code verification failed or absent on {doc.doc_type} certificate")

            # Check Authority Legitimacy
            auth_normalized: str = doc.issuing_authority.lower().strip()
            is_recognized: bool = any(
                re.search(pattern, auth_normalized) for pattern in self.RECOGNIZED_AUTHORITY_PATTERNS
            )
            if not is_recognized:
                suspicious_authorities += 1
                reasons.append(f"Unrecognized issuing authority '{doc.issuing_authority}' on {doc.doc_type}")

        # Compute risk score
        sig_penalty: float = (missing_signatures / total_docs) * 0.40
        qr_penalty: float = (unverified_qr / total_docs) * 0.35
        auth_penalty: float = (suspicious_authorities / total_docs) * 0.25

        risk_score: float = round(min(1.0, sig_penalty + qr_penalty + auth_penalty), 4)
        flagged: bool = risk_score >= 0.35

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
            signal_name="authority_verifier",
            risk_contribution=risk_score,
            flagged=flagged,
            severity=severity,
            reasons=reasons if reasons else ["All issuing authorities and digital seals verified successfully"],
            metadata={
                "total_docs": total_docs,
                "missing_signatures": missing_signatures,
                "unverified_qr": unverified_qr,
                "suspicious_authorities": suspicious_authorities,
            },
        )
