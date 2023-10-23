const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    productPictures: Array,
    slug: {
      type: String,
      required: true,
      // unique: true,
      // index: true,
    },
    price: {
      type: String,
      required: true,
    },
    sale_price: {
      type: String,
    },
    LongDescription: {type: String},
    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    colors: [{ type: Schema.Types.ObjectId, ref: "Color" }],
    sizes: [{ type: Schema.Types.ObjectId, ref: "Size" }],

    best_seller: Boolean,
    featured: Boolean,
    stock: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
