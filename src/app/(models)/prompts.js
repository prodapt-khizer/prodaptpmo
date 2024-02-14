import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false, // Disable command buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const promptschema = new Schema(
  {
    prompt_title:String,
    prompt_category: String,
    prompt_value: String,
    hit_count: Number,
  }
);

const Prompts = mongoose.models.prompts || mongoose.model("prompts", promptschema);

export default Prompts;