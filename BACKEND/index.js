import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import leadRouter from "./routes/leadRoutes.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// ESM dirname helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON + CORS middleware
app.use(express.json());
app.use(cors());

// API routes first
app.use("/api/users", userRouter);
app.use("/api/leads", leadRouter);

// Static frontend (dist is inside backend folder now)
const staticDir = path.join(__dirname, "dist");
app.use(express.static(staticDir));

// SPA fallback (for React Router etc.)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(staticDir, "index.html"));
});

// Create server
const server = http.createServer(app);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
