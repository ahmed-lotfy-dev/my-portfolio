import mongoose from "mongoose";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse, NextConfig } from "next";

type Data = {
  name: string;
};

const mongoUri = process.env.MONGO_URI;
export async function connectdb() {
  const db = mongoose.connect(process.env.MONGO_URI as string);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  connectdb();
  console.log("Connected to DB");
  res.status(200).json({ name: "John Doe" });
}
