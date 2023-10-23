const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  status: Boolean,
  product: { type: Object },
});

module.exports = mongoose.model("checkout", checkoutSchema);
