// TEMPORARY UTILITY - Remove after testing
// Run this once to set random visit counts for testing trending/popular features

import Post from "./models/post.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB = process.env.MONGO;

mongoose
  .connect(MONGODB)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const updateVisitCounts = async () => {
  try {
    const posts = await Post.find({});

    for (let post of posts) {
      // Set random visit counts (0-100) for testing
      const randomVisits = Math.floor(Math.random() * 100);
      await Post.updateOne(
        { _id: post._id },
        { $set: { visit: randomVisits } }
      );
      console.log(`Updated ${post.title} - visits: ${randomVisits}`);
    }

    console.log("\n✅ All posts updated with random visit counts!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating visit counts:", error);
    process.exit(1);
  }
};

updateVisitCounts();
