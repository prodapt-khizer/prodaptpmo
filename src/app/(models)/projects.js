import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false, // Disable command buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const projectsschema = new Schema(
  {
    _id:String,
    name:String,
    start_date: String,
    end_date: String,
    managerId: String,
    status: String,
    accountId: String,
    resources: Array,
    taskIds: Array
  }
);

const Projects = mongoose.models.projects || mongoose.model("projects", projectsschema);

export default Projects;