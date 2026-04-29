import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  // minimal schema for populate refs
  name: String,
  avatar: String
}, { timestamps: true });

const TempUserModel = mongoose.model('user', tempUserSchema);

export default TempUserModel;

