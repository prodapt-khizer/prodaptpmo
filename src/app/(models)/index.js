import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const option = {};

if (!uri) throw new Error("Please add MongoDB URI to your local env");

let clientPromise = mongoose.connect(uri);

export default clientPromise

