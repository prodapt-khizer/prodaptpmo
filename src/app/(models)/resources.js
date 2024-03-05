import mongoose, { Schema } from "mongoose";

// Define your schema
const resourcesschema = new Schema(
  {
    _id: String,
    name: String,
    account: String,
    role: String,
    reportingManager: String,
    projects: Array,
    tasks: Array
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
const Resources = mongoose.models.resources || mongoose.model("resources", resourcesschema);

// Export the model
export default Resources;
