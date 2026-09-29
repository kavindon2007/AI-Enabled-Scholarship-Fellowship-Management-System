import { PriorityLevel } from "../types";

export interface ClassificationResult {
  isEscalationRisk: boolean;
  suggestedPriority: PriorityLevel;
  keywords: string[];
}

export const nlpClassifierService = {
  async analyzeText(text: string): Promise<ClassificationResult> {
    // Mock NLP categorization
    const lowerText = text.toLowerCase();

    let priority: PriorityLevel = "LOW";
    let isRisk = false;
    const keywords: string[] = [];

    if (lowerText.includes("urgent") || lowerText.includes("immediate")) {
      priority = "URGENT";
      isRisk = true;
      keywords.push("urgent");
    } else if (lowerText.includes("delay") || lowerText.includes("months")) {
      priority = "HIGH";
      isRisk = true;
      keywords.push("delay");
    } else if (lowerText.includes("rejection") || lowerText.includes("failed")) {
      priority = "MEDIUM";
      keywords.push("rejection");
    } else {
      keywords.push("general");
    }

    return {
      isEscalationRisk: isRisk,
      suggestedPriority: priority,
      keywords
    };
  }
};
