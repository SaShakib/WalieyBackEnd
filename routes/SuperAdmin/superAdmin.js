const express = require("express");
const router = express.Router();
const { isSuperAdmin } = require("../../middleware/middleware");
const Color = require("../../models/colors");
const Category = require("../../models/category");
const Product = require("../../models/products");
const location = require("../../models/location");
const size = require("../../models/size");
const checkout = require("../../models/checkout");

router.put("/color/:id", isSuperAdmin, (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name, hex: req.body.hex },
    { useFindAndModify: false, new: true },
    (err, success) => {
      if (err) return res.status(400).json({ err });
      if (success)
        return res.status(200).json({ message: "Color updated Succesfully" });
      else {
        res.status(400).json({ message: "something went wrong" });
      }
    }
  );
});

router.delete("/color/:id", isSuperAdmin, (req, res) => {
  Color.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Color deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});

router.put("/category/:id", isSuperAdmin, (req, res) => {
  Category.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { useFindAndModify: false, new: true },
    (err, success) => {
      if (err) return res.status(400).json({ err });
      if (success)
        return res
          .status(200)
          .json({ message: "Category updated Succesfully" });
      else {
        res.status(400).json({ message: "something went wrong" });
      }
    }
  );
});

router.delete("/category/:id", isSuperAdmin, (req, res) => {
  //done
  Category.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Category deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});

router.put("/location/:id", isSuperAdmin, (req, res) => {
  location.findOneAndUpdate(
    { _id: req.params.id },
    {
      place: req.body.place,
      zilla: req.body.zilla,
      upozilla: req.body.upozilla,
    },
    { useFindAndModify: false, new: true },
    (err, success) => {
      if (err) return res.status(400).json({ err });
      if (success)
        return res
          .status(200)
          .json({ message: "Location updated Succesfully" });
      else {
        res.status(400).json({ message: "something went wrong" });
      }
    }
  );
});

router.delete("/location/:id", isSuperAdmin, (req, res) => {
  location.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Location deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});
//done
router.get("/products", isSuperAdmin, (req, res) => {
  Product.find({})
    .populate("colors sizes category")
    .populate({ path: "createdBy", select: "_id shopname location" })
    .exec((err, products) => {
      if (err) return res.status(400).json({ err });
      if (products) return res.status(200).json({ products });
    });
});
//done
router.delete("/products/:id", isSuperAdmin, (req, res) => {
  console.log(req.params.id);
  Product.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Products deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});
//done
router.put("/products/:id", isSuperAdmin, (req, res) => {
  console.log(req.params.id, req.body.featured, req.body.best_seller);
  Product.findOneAndUpdate(
    { _id: req.params.id },
    { featured: req.body.featured, best_seller: req.body.best_seller },
    { useFindAndModify: false, new: true },
    (err, success) => {
      if (err) return res.status(400).json({ err });
      if (success)
        return res.status(200).json({ message: "Product updated Succesfully" });
      else {
        res.status(400).json({ message: "something went wrong" });
      }
    }
  );
});

router.put("/size/:id", isSuperAdmin, (req, res) => {
  size.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { useFindAndModify: false, new: true },
    (err, success) => {
      if (err) return res.status(400).json({ err });
      if (success)
        return res.status(200).json({ message: "size updated Succesfully" });
      else {
        res.status(400).json({ message: "something went wrong" });
      }
    }
  );
});

router.delete("/size/:id", isSuperAdmin, (req, res) => {
  size.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Size deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});

router.get("/orders", isSuperAdmin, (req, res) => {
  checkout.find({}).exec((err, success) => {
    if (err) return res.status(400).json({ message: "Something went wrong" });
    if (success) {
      return res.status(201).json({ success });
    }
  });
});

router.put("/order/:id", isSuperAdmin, (req, res) => {
  checkout.findOneAndUpdate(
    { _id: req.params.id },
    { status: req.body.status },
    { useFindAndModify: false, new: true },
    (err, success) => {
      if (err) return res.status(400).json({ err });
      if (success)
        return res.status(200).json({ message: "Order updated Succesfully" });
      else {
        res.status(400).json({ message: "something went wrong" });
      }
    }
  );
});

router.delete("/order/:id", isSuperAdmin, (req, res) => {
  checkout.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "order deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});




module.exports = router;
