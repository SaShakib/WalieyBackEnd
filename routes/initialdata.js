const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const Category = require("../models/category");
const Admin = require("../models/admin");

const initialData = async (req, res) => {
  const shops = await Admin.find({})
    .select("_id firstname lastname location phone email shopname profilePic")
    .populate({ path: "location", select: "_id place" })
    .exec();
  const bestseller = await Product.find({ best_seller: "true" })
    .populate("colors sizes category")
    .populate({ path: "createdBy", select: "_id shopname location" })
    .exec();
  //best seller
  const featured = await Product.find({ featured: "true" })
    .populate("colors sizes category")
    .populate({ path: "createdBy", select: "_id shopname location" })
    .exec();
  //featured
  const categories = await Category.find({}).exec();
  //get all the categories
  const products = await Product.find({})
    //find all the products
    .select("_id name price slug description productPictures category") //select these
    .populate({ path: "category", select: "_id name" }) //populate category and id of selected items
    .exec(); //and execute
 
  res.status(200).json({
    categories, products, featured, bestseller, shops
  });
};
router.get("/", initialData);

module.exports = router;
