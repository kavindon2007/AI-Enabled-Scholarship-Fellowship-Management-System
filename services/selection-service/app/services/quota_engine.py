from typing import List, Any, Dict
from app.schemas.selection_schemas import ApplicationScore, QuotaAllocation, MeritListEntry

class QuotaEngine:
    def __init__(self) -> None:
        pass

    def apply_quotas(self, applications: List[ApplicationScore], total_slots: int) -> List[MeritListEntry]:
        """
        Applies quotas (PVTG, Female, Divyangjan) and determines status.
        """
        results: List[MeritListEntry] = []
        slots_remaining = total_slots

        for idx, app in enumerate(applications):
            quotas_applied: List[QuotaAllocation] = []

            if app.category == "PVTG":
                quotas_applied.append(QuotaAllocation(
                    category="PVTG",
                    allocated=True,
                    description="PVTG Quota matching"
                ))

            if app.is_female:
                quotas_applied.append(QuotaAllocation(
                    category="FEMALE",
                    allocated=True,
                    description="Female Horizontal Quota"
                ))

            if app.is_divyangjan:
                quotas_applied.append(QuotaAllocation(
                    category="DIVYANGJAN",
                    allocated=True,
                    description="Divyangjan Horizontal Quota"
                ))

            if len(quotas_applied) == 0:
                # Fallback to base category
                if app.category in ["GENERAL", "OBC", "SC", "ST"]:
                    cat_literal = app.category
                else:
                    cat_literal = "GENERAL"

                quotas_applied.append(QuotaAllocation(
                    category=cat_literal,  # type: ignore
                    allocated=True,
                    description=f"{app.category} Quota"
                ))

            status_val = "SELECTED" if slots_remaining > 0 else "WAITLISTED"
            if slots_remaining > 0:
                slots_remaining -= 1

            results.append(MeritListEntry(
                application_id=app.application_id,
                student_id=app.student_id,
                score=app.base_score,
                rank=idx + 1,
                quotas_applied=quotas_applied,
                status=status_val  # type: ignore
            ))

        return results
