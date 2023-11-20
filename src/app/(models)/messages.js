import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const messageschema = new Schema(
  {
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