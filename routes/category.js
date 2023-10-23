const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const { requireSignin } = require("../middleware/middleware");
const Category = require("../models/category");
const slugify = require("slugify");
const Product = require("../models/products");

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

// router.post('/category/create', requireSignin, adminMiddleware, upload.single('categoryImage'), addCategory);
// router.get('/category/getcategory', getCategories);
router.get("/all", (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) return res.status(400).json({ err });
    else {
      return res.status(200).json({ categories });
    }
  });
});

router.get("/", (req, res) => {
  Category.find({}).exec((err, success) => {
    if (err) console.log(err);
    let categoryList = [];

    success.map(async (cat) => {
      if (cat.parentId === undefined) {
        categoryList.push(cat);
      }
    });

    return res.status(200).json({ categoryList });
  });
});

router.post(
  "/create",
  // requireSignin,
  upload.single("categoryImage"),
  (req, res) => {
    Category.findOne({ name: req.body.name }).exec((err, data) => {
      if (data) {
        return res.status(400).json({ message: "Already Exist" });
      } else {
        const categoryObj = {
          name: req.body.name,
          slug: slugify(req.body.name),
        };
        if (req.body.parentId) {
          console.log(req.body.parentId);
          categoryObj.parentId = req.body.parentId;
        }

        if (req.file) {
          categoryObj.categoryImage =
            process.env.API + "/public/" + req.file.filename;
        }

        const cat = new Category(categoryObj); //pass category obj and we will save cat
        cat.save((error, category) => {
          if (error) return res.status(400).json({ error });
          if (category) {
            return res
              .status(201)
              .json({ message: "Category created Successfully" });
          }
        });
      }
    });
  }
);

router.delete("/:id", requireSignin, (req, res) => {
  Category.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Category deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});

router.get("/:slug", async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ category: category._id })
    .populate("colors category sizes")
    .populate({ path: "createdBy", select: "_id shopname location" })
    .exec();

  if (category && products) {
    return res.status(200).json({ category, products });
  }
});

router.get("/parent/:id", async (req, res) => {
  const children = await Category.find({ parentId: req.params.id }).exec();
  const products = await Product.find({ category: req.params.id })
    .populate("colors category sizes")
    .populate({ path: "createdBy", select: "_id shopname location" })
    .exec();
  if (children && products) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return res
      .status(200)
      .json({ children, products: products.slice(startIndex, endIndex) });
  }
});

module.exports = router;
