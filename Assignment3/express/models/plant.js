const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: String,
  species: String,
  price: Number,
  description: String,
});

const Plant = mongoose.model("plant", plantSchema);

module.exports = Plant;

