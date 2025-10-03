import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/user-router.js";
import authRouter from "./routers/auth-router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";
import adminRouter from "./routers/admin-router.js";
import internRouter from "./routers/intern-router.js";
import appRouter from "./routers/appRouter.js";
import "./Jobs/taskReminderJob.js";
import http from 'http';
import { Server } from 'socket.io';
import { setupSocketHandlers } from "./Web-Socket/socket.js";



dotenv.config();
const app = express();
const server = http.createServer(app); 


app.use(
  cors({

    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/intern",internRouter);
app.use("/api/app",appRouter);




app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello InternGuru" });
});


server.listen(3000, () => {
  console.log("🚀 Server + WebSocket started on port 3000");
});


setupSocketHandlers(io);


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
