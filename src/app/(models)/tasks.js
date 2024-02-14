import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false, // Disable command buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const tasksschema = new Schema(
  {
    _id:String,
    name:String,
    start_date: String,
    end_date: String,
    projectId: String,
    status: String,
    resourceId: String,
    accoutnId: String
  }
);

const Tasks = mongoose.models.tasks || mongoose.model("tasks", tasksschema);

export default Tasks;