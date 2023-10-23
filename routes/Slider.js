const express = require("express");
const router = express.Router();
const Slider = require("../models/slider");
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const { isSuperAdmin } = require("../middleware/middleware");
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

router.post(
  "/slider/upload",
  isSuperAdmin,
  upload.single("slider"),
  (req, res) => {
    if (req.file) {
      const slider = req.file.filename;
      const slid = new Slider({ slider }); //pass category obj and we will save cat
      slid.save((error, slid) => {
        if (error) return res.status(400).json({ error });
        if (slid) {
          return res
            .status(201)
            .json({ message: "Slider Image Saved Successfully" });
        }
      });
    }
  }
);

router.get("/slider", (req, res) => {
  Slider.find({}).exec((err, slid) => {
    if (err) return res.status(400).json({ error });
    if (slid) {
      return res.status(201).json({ slid });
    }
  });
});

router.delete("/slider/delete/:id", isSuperAdmin, (req, res) => {
  Slider.findByIdAndDelete(
    { _id: req.params.id },
    { useFindAndModify: false }
  ).exec((err, success) => {
    if (success) {
      unlinkAsync(
        path.join(path.join(path.dirname(__dirname), "uploads"), success.slider)
      );
      return res
        .status(200)
        .json({ message: "Slider is deleted Successfully" });
    }
  });
});
module.exports = router;
