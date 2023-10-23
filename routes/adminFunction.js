const express = require("express");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  Admin.findOne({ phone: req.body.phone }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({ message: "Already has an account" });
    }

    const {
      lastname,
      phone,

      shopname,
      location,
      password,
    } = req.body;

    const hash_password = await bcrypt.hash(password, 10);
    const adminObj = {
      firstname: req.body.firstname,
      lastname,
      phone,

      shopname,
      location,
      hash_password,
    };
    if (req.file) {
      adminObj.profilePic = process.env.API + "/public/" + req.file.filename;
    }
    console.log(adminObj);
    const admin = new Admin(adminObj);

    admin.save((err, data) => {
      if (err) {
        return res.status(400).json({ err, message: "something went wrong" });
      }
      if (data) {
        return res.status(201).json({
          message: "Shop Created successfully",
        });
      };
    });
  });
};
exports.signin = (req, res) => {
  if (req.body.phone) {
    Admin.findOne({ phone: req.body.phone }).exec((err, user) => {
      if (err) return res.status(400).json({ err });
      if (user) {
        const { hash_password } = user;
        const { password } = req.body;
        if (password && hash_password) {
          console.log(hash_password, password);

          bcrypt.compare(password, hash_password, function (err, result) {
            if (err) throw err;
            if (result == true) {
              const token = jwt.sign({ _id: user._id }, process.env.jwt_pass);
              const {
                _id,
                firsname,
                lastname,

                role,
                shopname,
                location,
                profilePic,
              } = user;
              res.cookie("token", token, { expiresIn: "30d" });
              res.status(200).json({
                token,
                user: {
                  _id,
                  firsname,
                  lastname,
                  role,
                  shopname,
                  location,
                  profilePic,
                },
              });
            } else {
              return res.status(400).json({ message: "invalid password" });
            }
          });
        }
      } else {
        res.status(400).json({ message: "Nothing founded" });
      }
    });
  } else {
    res.status(400).json({ message: "Enter Information" });
  }
};

exports.signout = (req, res) => {
  console.log("working fine");
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};
