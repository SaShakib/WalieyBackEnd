const { query } = require("express");
const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.jwt_pass, (err, decoded) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return res
            .status(500)
            .json({ message: "Token Expired Login back", expired: true });
        }
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
};
exports.isSuperAdmin = (req, res, next) => {
  const { superadmin, authorization } = req.headers;

  if (superadmin === "true" && authorization) {
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.superAdminSecret, (err, decoded) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return res.status(400).json({ message: "Token Expired Login back" });
        }
      }
      if (decoded) {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(400).json({ message: "Login to try" });
  }
};

exports.paginatedResults = (req, res, model) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < model.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = model.slice(startIndex, endIndex);

  res.json(results);
};
