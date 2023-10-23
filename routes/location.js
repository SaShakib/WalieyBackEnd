const express = require("express");
const router = express.Router();
const Location = require("../models/location");
const { requireSignin } = require("../middleware/middleware");
const Admin = require("../models/admin");

router.post(
  "/create",
  requireSignin,

  (req, res) => {
    const { place, zilla, upozilla } = req.body;
      const location = new Location({
        place,
        zilla,
        upozilla,
      });

      location.save((error, location) => {
        if (error) return res.status(400).json({ error });
        if (location) {
          return res.status(201).json({ message: "Created SuccessFully" });
        }
      });
    });

router.get("/", (req, res) => {
  Location.find({}).exec((err, location) => {
    if (err) return res.status(400).json({ err });
    if (location) {
      return res.status(200).json({ location });
    }
  });
});

router.get("/:place", async (req, res) => {
  const place = req.params.place;

  const location = await Location.findOne({ place: place }).exec();
  Admin.find({ location: location._id })
    .select("_id firstname lastname location phone email shopname")
    .populate({ path: "location", select: "_id place" })
    .exec((err, shops) => {
      if (err) return res.status(400).json({ err });
      if (shops) {
        return res.status(200).json({
          shops,
        });
      } else {
        return res
          .status(400)
          .json({ message: "No Avaiable shops in This location" });
      }
    });
});

router.delete("/:id", requireSignin, (req, res) => {
  Location.findOneAndDelete({ _id: req.params.id }).exec((err, success) => {
    if (err) return res.status(400).json({ err });
    if (success)
      return res.status(200).json({ message: "Category deleted Succesfully" });
    else {
      res.status(400).json({ message: "something went wrong" });
    }
  });
});

module.exports = router;
