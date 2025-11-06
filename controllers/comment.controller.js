import { set } from "mongoose";
import commentModel from "../models/comment.model.js";
import userModel from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  const comments = await commentModel
    .find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });
  res.status(200).json(comments);
};

export const addComment = async (req, res) => {
  const clerkUserId = req.auth().userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await userModel.findOne({ clerkUserId });

  const newComment = new commentModel({
    ...req.body,
    user: user._id,
    post: postId,
  });

  const savedComment = await newComment.save();

  setTimeout(() => {
    res.status(201).json(savedComment);
  }, 1000);
};
export const deleteComment = async (req, res) => {
  const clerkUserId = req.auth().userId;
  const id = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth().sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json("Comment has been deleted");
  }
  const user = await userModel.findOne({ clerkUserId });
  const deleteComment = await commentModel.findOneAndDelete({
    _id: id,
    user: user._id,
  });

  if (!deleteComment) {
    return res
      .status(404)
      .json(
        "Comment not found or you are not authorized to delete this comment."
      );
  }

  res.status(200).json("Comment deleted successfully.");
};
