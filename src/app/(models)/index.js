import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("Please add MongoDB URI to your local env");

let clientPromise = null;

async function connectToDatabase() {
  try {
    const client = await mongoose.connect(uri, {
      bufferCommands: false, // Disable command buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    clientPromise = Promise.resolve(client);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    clientPromise = Promise.reject(error);
  }
}

// Call the function to connect to the database
connectToDatabase();

export default clientPromise;
