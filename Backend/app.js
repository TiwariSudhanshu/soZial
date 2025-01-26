import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: 'https://sozial.onrender.com/',
    credentials: true,
  })
);

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(cookieParser());

// Importing

import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js"
import postRouter from './routes/post.routes.js'
import messageRouter from './routes/message.routes.js'
import verifyRouter from './routes/verify.routes.js'
app.use("/api/v1/user", userRouter);
app.use("/api/v1/profiles", profileRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/message", messageRouter)
app.use("/api/v1/verify", verifyRouter)

export default app;
