const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  name: {type: String, require: true}, 
  hex: String,
});

module.exports = mongoose.model("Color", colorSchema);
