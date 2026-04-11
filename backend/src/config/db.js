import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }catch(error){
        console.error("Error connecting to MangoDB on Port: 5001", error);
        process.exit(1); //exit with Failure
    }
}
