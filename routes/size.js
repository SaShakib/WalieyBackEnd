const express = require("express");
const router = express.Router();
const Size = require('../models/size');
const { requireSignin }=require("../middleware/middleware");


router.post("/create", requireSignin, (req, res) => {
  console.log(req.body)
  const { name} = req.body;
  const size = new Size({
   name
  });

  size.save((error, size) => {
    if (error) return res.status(400).json({ error });
    if (size) {
      return res.status(201).json({ message: 'Created SuccessFully' });
    }
  });
  });

  router.get("/", (req, res) => {
    Size.find({}).exec((err, size) => {
      if (err) return res.status(400).json({ err });
      if (size) {
        return res.status(200).json({ size });
      }
    });
  });

  router.delete("/:id", requireSignin, (req, res) => {
    Size.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
      if (err) return res.status(400).json({ err });
      if (success)
        return res.status(200).json({ message: "Size deleted Succesfully" });
      else {
        res.status(400).json({ message: "something went wrong" });
      }
    });
  });
module.exports = router;  