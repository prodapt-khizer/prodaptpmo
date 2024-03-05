import mongoose, { Schema } from "mongoose";

// Define your schema
const projectsschema = new Schema(
  {
    _id: String,
    name: String,
    start_date: String,
    end_date: String,
    managerId: String,
    status: String,
    accountId: String,
    resources: Array,
    taskIds: Array
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
const Projects = mongoose.models.projects || mongoose.model("projects", projectsschema);

// Export the model
export default Projects;
