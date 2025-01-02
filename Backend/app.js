import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(cookieParser());

// Importing

import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js"
app.use("/api/v1/user", userRouter);
app.use("/api/v1/profiles", profileRouter)

export default app;
