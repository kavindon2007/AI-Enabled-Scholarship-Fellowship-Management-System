import { Router } from "express";
import { grievanceController } from "../controllers/grievanceController";

const router = Router();

// POST /
router.post("/", grievanceController.create);

// GET /queue
router.get("/queue", grievanceController.getQueue);

// GET /:ticketId
router.get("/:ticketId", grievanceController.getById);

// PATCH /:ticketId/resolve
router.patch("/:ticketId/resolve", grievanceController.resolve);

// POST /:ticketId/escalate
router.post("/:ticketId/escalate", grievanceController.escalate);

// POST /:ticketId/forward
router.post("/:ticketId/forward", grievanceController.forward);

export default router;
