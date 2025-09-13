import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await  mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb connected successfully")
    }
    catch(e){
        console.log("mongodb not connected")
    }
}


export default connectDB