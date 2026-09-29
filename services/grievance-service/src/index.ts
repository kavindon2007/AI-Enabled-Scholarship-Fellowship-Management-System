import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import grievanceRoutes from "./routes/grievances";
import { resolve } from "path";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Apply correlation ID middleware
app.use((req, res, next) => {
  if (!req.headers["x-request-id"]) {
    req.headers["x-request-id"] = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    dependencies: {
      kafka: "mock-ok",
      postgres: "mock-ok"
    }
  });
});

// Routes
app.use("/api/v1/grievances", grievanceRoutes);

// Error Handler
app.use(errorHandler);

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Grievance Service running on port ${PORT} in ${config.NODE_ENV} mode.`);
});

export default app;
