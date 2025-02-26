import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        const url = connection.connection.host;
        console.log(`Database connected to: ${url}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}