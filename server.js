const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const shortid = require("shortid");
const multer = require("multer");
const cors = require("cors");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "/Backend rest api/uploads"));
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

//routes
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/category");
const productsroutes = require("./routes/products");
const locationRoutes = require("./routes/location");
const colorRoutes = require("./routes/color");
const sizeRoutes = require("./routes/size");
const FacebookRoutes = require("./routes/FaceBook");
const shops = require("./routes/shops");
const superAdminLogin = require("./routes/SuperAdmin/Login");
const superAdmin = require("./routes/SuperAdmin/superAdmin");
const checkout = require("./routes/checkout");
const besteller = require("./routes/bestseller");
const featured = require("./routes/featured");
const initial = require("./routes/initialdata");
const slider = require("./routes/Slider");
env.config();

mongoose
  .connect(
    `mongodb+srv://Waliey:wwKDHtfFSpzFKBS0@cluster0.7pyhb.mongodb.net/test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/admin", adminRoutes);
app.use("/category", categoryRoutes);
app.use("/products", productsroutes);
app.use("/location", locationRoutes);
app.use("/colors", colorRoutes);
app.use("/size", sizeRoutes);
app.use("/facebook", FacebookRoutes);
app.use("/shops", shops);
app.use("/superAdmin", superAdminLogin);
app.use("/superAdmin", superAdmin);
app.use("/checkout", checkout);
app.use("/best", besteller);
app.use("/featured", featured);
app.use("/initialdata", initial);
app.use("/", slider);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(process.env.PORT, () => console.log(process.env.PORT));
