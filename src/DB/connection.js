import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000
    });
    console.log("DB connected successfully ✅");
  } catch (error) {
    console.log("Fail to connect on DB ❌", error);
  }
};

export default connectDB;
