import mongoose from "mongoose";
const connectDB = async() =>{

   try {
    const uri = process.env.MONGO_URI
     const reslut = await mongoose.connect
     (uri,{serverSelectionTimeoutMS:30000})


     
     
     console.log("DB connected successfully✅");
     
   } catch (error) {
    console.log(`fail to  connect on DB ❌`,error);
   }
}
export default connectDB
