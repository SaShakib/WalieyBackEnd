const express = require("express");
const router = express.Router();
const Checkout = require("../models/checkout");
const { requireSignin } = require("../middleware/middleware");
const Products = require("../models/products");

router.post("/", (req, res) => {
  const { fullname, phone, address1, address2, status, product } = req.body;
  const checkout = new Checkout({
    fullname,
    phone,
    address1,
    address2,
    product,
    status,
  });
  console.log(checkout);
  checkout.save((err, success) => {
    if (err) return res.status(400).json({ message: "Something went wrong" });
    if (success) {
      return res.status(201).json({ message: "Ordered successfully" });
    }
  });
});

router.get("/orders", requireSignin, (req, res) => {
  Checkout.find({}).exec(async (err, success) => {
    return res.status(200).json({admin: req.user._id, success});
  });
});

module.exports = router;
