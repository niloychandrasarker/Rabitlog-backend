import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  // If already connected, return early
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  // If mongoose is already connecting or connected, wait for it
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGO_URL || process.env.MONGO,
      {
        // These options help with serverless environments
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      }
    );

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
};

export default connectDB;
