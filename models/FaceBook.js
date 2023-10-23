const mongoose = require("mongoose");

const FacebookSchema = new mongoose.Schema({
  user: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("facebook", FacebookSchema);
