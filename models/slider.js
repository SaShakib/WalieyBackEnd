const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const SliderSchema = new Schema(
  {
    slider: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Slider", SliderSchema);
