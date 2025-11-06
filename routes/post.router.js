import express from "express";
import postModel from "../models/post.model.js";
import { createPost, deletePost, featurePost, getPost, getPosts, uploadAuth } from "../controllers/post.controller.js";
import increaseVisit from "../middleware/increaseVisits.js";
const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug",increaseVisit, getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);



export default router;
