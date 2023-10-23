const express = require("express");
const router = express.Router();

const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const { signup, signin, signout } = require("./adminFunction");

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

router.post("/signup", upload.single("profilePic"), signup);
router.post("/signin", signin);
router.post("/signout", signout)

module.exports = router;
