
import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false, // Disable command buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const accountsschema = new Schema(
  {
    _id:Number,
    name:String,
  }
);

const Accounts = mongoose.models.accounts || mongoose.model("accounts", accountsschema);

export default Accounts;