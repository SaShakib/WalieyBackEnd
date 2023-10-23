const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Products = require("../models/products");
const { paginatedResults } = require("../middleware/middleware");
router.get("/", (req, res) => {
  Admin.find({})
    .select("_id firstname lastname location phone email shopname profilePic")
    .populate({ path: "location", select: "_id place" })
    .exec((err, shops) => {
      if (shops) return res.status(200).json({ shops });
    });
});

router.get("/:id", async (req, res) => {
  const admin = await Admin.findOne({ _id: req.params.id })
    .select("_id firstname lastname location phone email shopname profilePic")

    .populate({ path: "location", select: "_id place" })
    .exec();

  const products = await Products.find({ createdBy: admin._id })
    .populate("category sizes colors")
    .exec();
  if (admin && products) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

   
    
    return res
      .status(200)
      .json({ admin, products: products.slice(startIndex, endIndex) });
  }
});

module.exports = router;
