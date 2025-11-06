import "dotenv/config";
import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.router.js";
import commentRouter from "./routes/comment.router.js";
import webhookRouter from "./routes/webhook.router.js";
import connectDB from "./lib/connectDB.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";

const app = express();
app.use(cors(process.env.CLIENT_URL || "*"));
app.use(clerkMiddleware());
app.use("/webhooks", webhookRouter);
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.get("/auth-state", (req, res) => {
//   // Clerk deprecated `req.auth` in favor of `req.auth()` — support both to
//   // remain compatible with older and newer Clerk versions.
//   const authState = typeof req.auth === "function" ? req.auth() : req.auth;
//   res.json(authState);
// });

// app.get("/protect", (req, res) => {
//   // Clerk deprecated `req.auth` in favor of `req.auth()` — support both to
//   // remain compatible with older and newer Clerk versions.
//   const {userId} = typeof req.auth === "function" ? req.auth() : req.auth;
//   if(!userId) {
//       return res.status(401).json("Unauthorized");
//   }
//   res.status(200).json({ message: "You are authorized", userId });
// });

// app.get("/protect2", requireAuth(), (req, res) => {
//  res.status(200).json("content");
// });

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

export default app;
