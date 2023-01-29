import mongoose from "mongoose";

const connectToDb = async () => mongoose.connect(process.env.DATABASE_URL);

export default connectToDb;
