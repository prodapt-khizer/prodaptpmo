import mongoose, { Schema } from "mongoose";

// Define your schema
const promptschema = new Schema(
  {
    prompt_title: String,
    prompt_category: String,
    prompt_value: String,
    hit_count: Number,
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
const Prompts = mongoose.models.prompts || mongoose.model("prompts", promptschema);

// Export the model
export default Prompts;
