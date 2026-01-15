import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import listingRouter from "./routes/listingRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server is Live 🚀");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/listing" , listingRouter);
app.use("/api/chat" , chatRouter);

app.get("/api/test", (req, res) => {
  res.json({ message: "Clerk protected route working" });
});

export default app;