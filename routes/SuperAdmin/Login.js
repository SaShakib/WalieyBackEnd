const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const login = (req, res) => {
  const { user, password } = req.body;

  if (user && password) {
    if (
      user == process.env.superAdminUser &&
      password == process.env.superAdminPass
    ) {
      const token = jwt.sign({ user: user }, process.env.superAdminSecret);
      return res
        .status(200)
        .json({ superAdmin: true, token, role: "superadmin" });
    } else {
      return res.status(400).json({ message: "Wrong UserName and Password" });
    }
  }
  res.status(400).json({ message: "You need to give the user information " });
};

router.post("/login", login);

module.exports = router;
