import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import marketRoutes from "./routes/market";
import portfolioRoutes from "./routes/portfolio";
import smartMoneyRoutes from "./routes/smartMoney";
import botsRoutes from "./routes/bots";
import copilotRoutes from "./routes/copilot";
import signalsRoutes from "./routes/signals";
import alertsRoutes from "./routes/alerts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "AI Track Stocks backend running" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/smart-money", smartMoneyRoutes);
app.use("/api/bots", botsRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/signals", signalsRoutes);
app.use("/api/alerts", alertsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
