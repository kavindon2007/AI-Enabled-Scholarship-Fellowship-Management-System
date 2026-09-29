import { PriorityLevel } from "../types";

export const slaEngine = {
  calculateSlaBreachTime(priority: PriorityLevel, createdAt: Date): Date {
    const breachTime = new Date(createdAt);

    switch (priority) {
      case "URGENT":
        breachTime.setHours(breachTime.getHours() + 24); // 24 hours
        break;
      case "HIGH":
        breachTime.setHours(breachTime.getHours() + 48); // 48 hours
        break;
      case "MEDIUM":
        breachTime.setDate(breachTime.getDate() + 7); // 7 days
        break;
      case "LOW":
        breachTime.setDate(breachTime.getDate() + 14); // 14 days
        break;
      default:
        breachTime.setDate(breachTime.getDate() + 7);
    }

    return breachTime;
  },

  isSlaBreached(breachTime: Date): boolean {
    return new Date() > breachTime;
  }
};
