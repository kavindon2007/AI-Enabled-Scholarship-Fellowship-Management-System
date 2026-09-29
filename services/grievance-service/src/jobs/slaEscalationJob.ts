import { grievanceRepository } from "../repositories/grievanceRepository";
import { slaEngine } from "../services/slaEngine";
import { grievanceService } from "../services/grievanceService";

export const slaEscalationJob = {
  async run(): Promise<void> {
    console.log("[Job] Running SLA escalation check");
    // Get OPEN or IN_PROGRESS tickets (would be a specific DB query in real implementation)
    const openTickets = await grievanceRepository.findQueue("OPEN", 100);
    const inProgressTickets = await grievanceRepository.findQueue("IN_PROGRESS", 100);

    const candidates = [...openTickets, ...inProgressTickets]
      .filter(t => !t.isEscalated);

    for (const ticket of candidates) {
      if (slaEngine.isSlaBreached(ticket.slaBreachAt)) {
        console.log(`[Job] Ticket ${ticket.id} SLA breached. Escalating.`);
        try {
          await grievanceService.escalateGrievance(ticket.id, { reason: "SLA Breach - Automated System" });
        } catch (error) {
          console.error(`[Job] Failed to escalate ticket ${ticket.id}`, error);
        }
      }
    }
  }
};
