from typing import List
from app.schemas.selection_schemas import ApplicationScore

class MeritCalculator:
    def calculate_scores(self, applications: List[ApplicationScore]) -> List[ApplicationScore]:
        """
        Calculates normalized scores for the applications.
        In a real scenario, this would have rules for Pre/Post Matric, NFST, NOS.
        For now, we just pass through or add some baseline metrics.
        """
        # Just sort them by base_score for baseline merit
        return sorted(applications, key=lambda x: x.base_score, reverse=True)
