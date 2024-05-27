const mongoose = require("mongoose");

const planterSchema = mongoose.Schema({
  name: String,
  material: String,
  price: Number,
  description: String,
});

const Planter = mongoose.model("planter", planterSchema);

module.exports = Planter;
