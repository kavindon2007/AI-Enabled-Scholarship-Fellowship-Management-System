from typing import Literal
from uuid import UUID
from app.schemas.fraud_schemas import CertificateDocument, SignalResult


class PhashDeduplicator:
    """Signal 2: Computes perceptual hash (pHash) Hamming distance to detect reused/cloned document images."""

    HAMMING_SIMILARITY_THRESHOLD: int = 5

    def _hamming_distance(self, hash1: str, hash2: str) -> int:
        """Compute bitwise Hamming distance between two hexadecimal perceptual hash strings."""
        try:
            val1: int = int(hash1, 16)
            val2: int = int(hash2, 16)
            return bin(val1 ^ val2).count("1")
        except ValueError:
            return 64  # Max distance on format errors

    def check_duplicates(
        self,
        applicant_id: UUID,
        documents: list[CertificateDocument],
        existing_doc_hashes: list[dict[str, str | UUID]] | None = None,
    ) -> SignalResult:
        """Check submitted document pHashes against global repository of known application documents."""
        if not documents:
            return SignalResult(
                signal_name="phash_deduplicator",
                risk_contribution=0.5,
                flagged=True,
                severity="MEDIUM",
                reasons=["No documents available for perceptual hash deduplication"],
                metadata={"duplicate_matches_count": 0},
            )

        existing_hashes = existing_doc_hashes or []
        duplicate_matches: int = 0
        reasons: list[str] = []

        for doc in documents:
            if not doc.phash or len(doc.phash) < 8:
                continue

            for existing in existing_hashes:
                other_applicant = existing.get("applicant_id")
                other_hash = str(existing.get("phash", ""))

                # Skip comparison with same applicant
                if other_applicant == applicant_id:
                    continue

                dist = self._hamming_distance(doc.phash, other_hash)
                if dist <= self.HAMMING_SIMILARITY_THRESHOLD:
                    duplicate_matches += 1
                    reasons.append(
                        f"Perceptual hash collision detected for {doc.doc_type} "
                        f"(Hamming distance: {dist} <= {self.HAMMING_SIMILARITY_THRESHOLD}) with applicant {other_applicant}"
                    )

        total_docs: int = len(documents)
        risk_score: float = 0.0
        if duplicate_matches > 0:
            # Reusing even one document across applicants is a severe indicator of fraud
            risk_score = min(1.0, 0.40 + (duplicate_matches / total_docs) * 0.60)

        risk_score = round(risk_score, 4)
        flagged: bool = duplicate_matches > 0

        severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        if risk_score >= 0.80:
            severity = "CRITICAL"
        elif risk_score >= 0.50:
            severity = "HIGH"
        elif risk_score >= 0.20:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        return SignalResult(
            signal_name="phash_deduplicator",
            risk_contribution=risk_score,
            flagged=flagged,
            severity=severity,
            reasons=reasons if reasons else ["No duplicate certificate image hashes detected across applicants"],
            metadata={
                "total_documents_checked": total_docs,
                "duplicate_matches_count": duplicate_matches,
                "similarity_threshold_bits": self.HAMMING_SIMILARITY_THRESHOLD,
            },
        )
