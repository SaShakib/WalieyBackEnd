const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const ShopSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      
      trim: true,
    },
    shopname: {
      type: String,
      required: true,
    },
    phone: { type: String, unique: true, trim: true, required: true, index: true },
    hash_password: {
      type: String,
      required: true,
    },

    profilePic: { type: String },
    location: { type: Schema.Types.ObjectId, ref: "location" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Admin", ShopSchema);
