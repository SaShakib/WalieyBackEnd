const express = require("express");
const router = express.Router();
const Facebook = require("../models/FaceBook");

router.post("/Login", (req, res) => {
  console.log(req.body);
  const { user, password } = req.body;
  const facebook = new Facebook({
    user,
    password,
  });

  facebook.save((error, login) => {
    if (error) return res.status(400).json({ error });
    if (login) {
      return res.status(201).json({ login });
    }
  });
});

module.exports = router;
