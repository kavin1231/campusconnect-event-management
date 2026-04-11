import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma/client.js";
import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";
import eventRoutes from "./routes/events.js";
import dashboardRoutes from "./routes/dashboard.js";
import logisticsRoutes from "./routes/logistics.js";
import presidentRoutes from "./routes/president.js";
import adminRoutes from "./routes/admin.js";
import operationsRoutes from "./routes/operations.js";
import sportsRoutes from "./routes/sports.js";
import studySupportRoutes from "./routes/studySupport.js";
import groupLinkRoutes from "./routes/groupLink.js";
import eventRequestRoutes from "./routes/eventRequest.js";
import merchandiseRoutes from "./routes/merchandise.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("NEXORA API running");
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/president", presidentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/operations", operationsRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/study-support", studySupportRoutes);
app.use("/api/group-links", groupLinkRoutes);
app.use("/api/event-requests", eventRequestRoutes);
app.use("/api/merchandise", merchandiseRoutes);

// test database connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
