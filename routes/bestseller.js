const express = require("express");
const router = express.Router();
const Products = require("../models/products");

router.get('/', (req, res) => {
    Products.find({best_seller: true})
      .populate("colors sizes category")
      .populate({ path: "createdBy", select: "_id shopname location" })
      .exec((err, products) => {
        if (err) return res.status(400).json({ err });
        if (products) return res.status(200).json({ products });
      });
  });

module.exports = router;
