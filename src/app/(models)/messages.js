import mongoose, { Schema } from "mongoose";

// Define your schema
const messageschema = new Schema(
  {
    _id: String,
    title: String,
    prompt: Array,
    response: Array,
    user: String,
    edited: Boolean
  },
  {
    timestamps: true,
  }
);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Disable command buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Handle error appropriately, e.g., exit the process
    process.exit(1);
  }
}

// Call the function to connect to the database
connectToDatabase();

// Define your model after the connection is established
const Messages = mongoose.models.messages || mongoose.model("messages", messageschema);

// Export the model
export default Messages;
