import mongoose, { Schema } from "mongoose";

// Define your schema
const accountsschema = new Schema(
  {
    _id: Number,
    name: String,
  }
);

// Define your model
const Accounts = mongoose.models.accounts || mongoose.model("accounts", accountsschema);

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

// Export the model
export default Accounts;
