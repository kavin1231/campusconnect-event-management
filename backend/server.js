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
// import studySupportRoutes from "./routes/studySupport.js";  // TODO: Convert to ES modules

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
// app.use("/api/study-support", studySupportRoutes);  // TODO: Convert to ES modules

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
