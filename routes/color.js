const express = require("express");
const router = express.Router();
const Color = require("../models/colors");
const { requireSignin } = require("../middleware/middleware");

router.post("/create", requireSignin, (req, res) => {
  console.log(req.body);
  const { name, hex } = req.body;
  const color = new Color({
    name,
    hex,
  });

  color.save((error, color) => {
    if (error) return res.status(400).json({ error });
    if (color) {
      return res.status(201).json({ message: "Created SuccessFully" });
    }
  });
});

router.get("/", (req, res) => {
  Color.find({}).exec((err, colors) => {
    if (err) return res.status(400).json({ err });
    if (colors) {
      return res.status(200).json({ colors });
    }
  });
});

router.delete("/:id", requireSignin, (req, res) => {
  Color.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Color deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});
module.exports = router;
