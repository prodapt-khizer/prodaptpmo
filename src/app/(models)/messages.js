import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false, // Disable command buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const messageschema = new Schema(
  {
    _id:String,
    title:String,
    prompt: Array,
    response: Array,
    user: String,
    edited: Boolean
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.models.messages || mongoose.model("messages", messageschema);

export default Messages;