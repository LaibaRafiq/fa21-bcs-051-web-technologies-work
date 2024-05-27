const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" }
 });
let user =mongoose.models.User|| mongoose.model("user", userSchema);
module.exports = user;