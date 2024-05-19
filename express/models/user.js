const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String}
);
let user =mongoose.models.User|| mongoose.model("user", userSchema);
module.exports = user;