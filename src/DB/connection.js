import mongoose from "mongoose";
const connectDB = async() =>{

   try {
    const uri = "mongodb://127.0.0.1:27017/sarahaApp"
     const reslut = await mongoose.connect
     (uri,{serverSelectionTimeoutMS:30000})


     
     
     console.log("DB connected successfully✅");
     
   } catch (error) {
    console.log(`fail to  connect on DB ❌`,error);
   }
}
export default connectDB