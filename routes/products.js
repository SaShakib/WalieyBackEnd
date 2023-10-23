const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const { requireSignin, paginatedResults } = require("../middleware/middleware");
const Products = require("../models/products");
const slugify = require("slugify");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.get("/admin", requireSignin, (req, res) => {
  const { _id } = req.user;

  Products.find({ createdBy: _id })
    .populate("colors sizes category")
    .populate({ path: "createdBy", select: "_id shopname location" })

    .exec((err, products) => {
      if (err) return res.status(400).json({ err });
      if (products) return res.status(200).json({ products });
    });
});

router.post("/upload", upload.array("ProductImage"), (req, res) => {
  let productPictures = []; //pic array

  if (req.files) {
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
      });

      return res.send(productPictures);
    }
  }
});

router.post(
  "/create",
  requireSignin,

  upload.array("ProductImage"),
  (req, res) => {
    const {
      name,
      description,
      price,
      sale_price,
      category,
      colors,
      stock,
      sizes,
      best_seller,
      featured,
      productPictures,
      LongDescription,
    } = req.body;

    const product = new Products({
      name,
      createdBy: req.user._id,
      description,
      LongDescription,
      category,
      sale_price,
      price,
      colors,
      sizes,
      stock,
      productPictures,
      slug: slugify(name + shortid.generate()),
      best_seller,
      featured,
    });

    product.save((error, product) => {
      //finally save
      if (error)
        return res
          .status(400)
          .json({ message: "Try with different Information, " });
      if (product) {
        res.status(201).json({ message: "Product Created Successfully" });
      }
    });
  }
);

router.get("/:id", (req, res) => {
  Products.findOne({ _id: req.params.id })
    .populate("colors sizes category")
    .populate({ path: "createdBy", select: "_id shopname location" })
    .exec(async (err, product) => {
      if (err) return res.status(400).json({ err });
      if (product) {
        const id = product.category[0]._id;
        const Similar = await Products.find({ category: id })
        .limit(10)
          .populate("colors category sizes")
          .populate({ path: "createdBy", select: "_id shopname location" })
          .exec();

        return res.status(200).json({ product, Similar });
      }

      //
    });
});

router.delete("/:id", requireSignin, (req, res) => {
  Products.findOne({ _id: req.params.id }).exec((err, product) => {
    if (err) return res.status(400).json({ err });

    const match = req.user._id == product.createdBy;

    if (!match) {
      return res.status(400).json({ message: "Authenticaton required" });
    } else {
      console.log("all fine");
      Products.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
        if (err) return res.status(400).json({ err });
        if (success)
          return res
            .status(200)
            .json({ message: "Products deleted Succesfully" });
        else {
          res.status(400).json({ message: "something went wrong" });
        }
      });
    }
  });
});

router.delete("/upload/:file", async (req, res) => {
  await unlinkAsync(
    path.join(path.join(path.dirname(__dirname), "uploads"), req.params.file)
  );
  res.end("Deleted");
});

router.put("/update/:id", requireSignin, (req, res) => {
  const {
    name,
    description,
    price,
    sale_price,
    category,
    colors,
    LongDescription,
    sizes,

    productPictures,
  } = req.body;
  const updateProduct = {
    name,
    description,
    price,
    sale_price,
    category,
    colors,
    LongDescription,
    sizes,
    productPictures,
  };
  console.log(req.body);
  Products.findOneAndUpdate(
    { _id: req.params.id },
    updateProduct,
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

router.put("/stock/:id", requireSignin, (req, res) => {
  Products.findOneAndUpdate(
    { _id: req.params.id },
    { stock: req.body.stock },
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

router.get("/filter/color", (req, res) => {
  Products.find({ colors: req.query.color })
    .populate("colors sizes category")
    .populate({ path: "createdBy", select: "_id shopname location" })
    .exec((err, products) => {
      if (err) return res.status(400).json({ err });
      if (products) paginatedResults(req, res, products);
    });
});

router.get("/", (req, res) => {
  if (req.query.size && req.query.size !== `""`) {
    if (req.query.sort === "LowPrice") {
      Products.find({ sizes: req.query.size })
        .sort({ price: 1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "HighPrice") {
      Products.find({ sizes: req.query.size })
        .sort({ price: -1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "nameAsce") {
      Products.find({ sizes: req.query.size })
        .sort({ name: 1 })

        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "nameDesc") {
      Products.find({ sizes: req.query.size })
        .sort({ name: -1 })

        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else {
      Products.find({ sizes: req.query.size })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    }
  } else if (req.query.color && req.query.color !== `""`) {
    if (req.query.sort === "LowPrice") {
      Products.find({ colors: req.query.color })
        .sort({ price: 1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "HighPrice") {
      Products.find({ colors: req.query.color })
        .sort({ price: -1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "nameAsce") {
      Products.find({ colors: req.query.color })
        .sort({ name: 1 })

        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "nameDesc") {
      Products.find({ colors: req.query.color })
        .sort({ name: -1 })

        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else {
      Products.find({ colors: req.query.color })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    }
  } else {
    if (req.query.sort === "LowPrice") {
      Products.find({})
        .sort({ price: 1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "HighPrice") {
      Products.find({})
        .sort({ price: -1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "nameAsce") {
      Products.find({})
        .sort({ name: 1 })

        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else if (req.query.sort === "nameDesc") {
      Products.find({})
        .sort({ name: -1 })

        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) paginatedResults(req, res, products);
        });
    } else {
      Products.find({})
        .populate("colors sizes category")
        .populate({ path: "createdBy", select: "_id shopname location" })
        .exec((err, products) => {
          if (err) return res.status(400).json({ err });
          if (products) {
            paginatedResults(req, res, products);
          }
        });
    }
  }
});

module.exports = router;
