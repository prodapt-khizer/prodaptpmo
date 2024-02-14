import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false, // Disable command buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const resourcesschema = new Schema(
  {
    _id:String,
    name:String,
    account: String,
    role: String,
    reportingManager: String,
    projects: Array,
    tasks: Array
  }
);

const Resources = mongoose.models.resources || mongoose.model("resources", resourcesschema);

export default Resources;