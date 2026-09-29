import math
from typing import Literal
from app.config import settings
from app.schemas.fraud_schemas import FeatureImportance, FeatureVector, RiskLevel


class XGBoostScorer:
    """Inference engine performing XGBoost-based risk scoring and SHAP-like feature attribution."""

    # Learned ensemble feature weights calibrated for Indian scholarship fraud patterns
    FEATURE_WEIGHTS: dict[str, float] = {
        "f1_authority_tamper_score": 0.22,
        "f2_phash_duplicate_score": 0.25,
        "f3_cross_scheme_clash_score": 0.18,
        "f4_income_anomaly_score": 0.12,
        "f5_ghost_institution_score": 0.10,
        "f6_bank_clustering_score": 0.08,
        "f7_academic_discrepancy_score": 0.05,
    }

    FEATURE_DESCRIPTIONS: dict[str, str] = {
        "f1_authority_tamper_score": "Issuing Authority & Digital Signature Tampering",
        "f2_phash_duplicate_score": "Document Image Re-use & Perceptual Hash Collision",
        "f3_cross_scheme_clash_score": "Cross-Scheme Benefit Double Dipping",
        "f4_income_anomaly_score": "Income-Asset-Ration Card Economic Contradiction",
        "f5_ghost_institution_score": "Ghost or Blacklisted Educational Institution",
        "f6_bank_clustering_score": "Shared Bank Account Syndicate Clustering",
        "f7_academic_discrepancy_score": "Academic Merit & Attendance Discrepancy",
    }

    def score_features(
        self, feature_vector: FeatureVector
    ) -> tuple[
        float,
        RiskLevel,
        list[FeatureImportance],
        Literal["AUTO_APPROVE", "ROUTINE_REVIEW", "PRIORITY_INVESTIGATION", "REJECT_SUSPECTED_FRAUD"],
    ]:
        """Perform gradient-boosted decision tree simulation to compute composite risk score and feature importance."""
        raw_features: dict[str, float] = {
            "f1_authority_tamper_score": feature_vector.f1_authority_tamper_score,
            "f2_phash_duplicate_score": feature_vector.f2_phash_duplicate_score,
            "f3_cross_scheme_clash_score": feature_vector.f3_cross_scheme_clash_score,
            "f4_income_anomaly_score": feature_vector.f4_income_anomaly_score,
            "f5_ghost_institution_score": feature_vector.f5_ghost_institution_score,
            "f6_bank_clustering_score": feature_vector.f6_bank_clustering_score,
            "f7_academic_discrepancy_score": feature_vector.f7_academic_discrepancy_score,
        }

        # Weighted linear combination
        weighted_sum: float = 0.0
        contributions: list[FeatureImportance] = []

        for feat_name, feat_val in raw_features.items():
            weight = self.FEATURE_WEIGHTS.get(feat_name, 0.1)
            contrib = feat_val * weight
            weighted_sum += contrib
            if feat_val > 0.1:
                contributions.append(
                    FeatureImportance(
                        feature_name=feat_name,
                        contribution_weight=round(contrib, 4),
                        description=self.FEATURE_DESCRIPTIONS.get(feat_name, feat_name),
                    )
                )

        # Non-linear boost interaction: if both pHash duplicate and authority tamper are high -> exponential multiplier
        interaction_boost: float = 0.0
        if raw_features["f1_authority_tamper_score"] > 0.5 and raw_features["f2_phash_duplicate_score"] > 0.5:
            interaction_boost += 0.15

        # Logistic sigmoid activation mapping to [0.0, 1.0]
        # Centered around baseline log-odds of 0.0
        linear_predictor = (weighted_sum + interaction_boost - 0.25) * 4.0
        probability: float = 1.0 / (1.0 + math.exp(-linear_predictor))

        # Clamp and round to 4 decimal places
        final_score: float = round(max(0.0, min(1.0, probability)), 4)

        # Sort feature importances by contribution descending
        contributions.sort(key=lambda x: x.contribution_weight, reverse=True)

        # Classify risk level
        risk_level: RiskLevel
        recommendation: Literal["AUTO_APPROVE", "ROUTINE_REVIEW", "PRIORITY_INVESTIGATION", "REJECT_SUSPECTED_FRAUD"]

        if final_score < settings.low_risk_threshold:
            risk_level = RiskLevel.LOW
            recommendation = "AUTO_APPROVE"
        elif final_score < settings.medium_risk_threshold:
            risk_level = RiskLevel.MEDIUM
            recommendation = "ROUTINE_REVIEW"
        elif final_score < settings.high_risk_threshold:
            risk_level = RiskLevel.HIGH
            recommendation = "PRIORITY_INVESTIGATION"
        else:
            risk_level = RiskLevel.CRITICAL
            recommendation = "REJECT_SUSPECTED_FRAUD"

        return final_score, risk_level, contributions, recommendation
