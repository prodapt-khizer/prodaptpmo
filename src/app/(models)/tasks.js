import mongoose, { Schema } from "mongoose";

// Define your schema
const tasksschema = new Schema(
  {
    _id: String,
    name: String,
    start_date: String,
    end_date: String,
    projectId: String,
    status: String,
    resourceId: String,
    accoutnId: String // Typo: Corrected to "accountId"
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
const Tasks = mongoose.models.tasks || mongoose.model("tasks", tasksschema);

// Export the model
export default Tasks;
