const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const pagesRoutes = require("./routes/pages");
const usersRoutes = require("./routes/users");

// Configuration where images should be stored and named
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const pageId = req.query.pageId;
      if (!pageId) {
        const err = new Error("Cannot upload image. No page id provided.");
        err.statusCode = 422;
        throw err;
      }
      const dir = `images/${pageId}`;
      fs.access(dir, (err) => {
        if (err) {
          return fs.mkdir(dir, (err) => cb(err, dir));
        } else {
          return cb(null, dir);
        }
      });
    } catch (err) {
      console.log(err);
      return cb(err, dir);
    }
  },
  filename: (req, file, cb) => {
    const hash =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    cb(null, hash + "-" + file.originalname);
  },
});

// Only allow image files to be uploaded
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  multer({
    storage: fileStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: fileFilter,
  }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/pages", pagesRoutes);
app.use("/users", usersRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, errCode: status, data: data });
});

// ---- CHECKING SERVER STATUS ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`**** SERVER STARTED AT PORT ${PORT} ****`);
});

// ----- CHECKING IF CONNECTED WITH DATABASE OR CATCH & DISPLAY ERRORS ----
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(`**** SOMETHING WENT WRONG **** `);
  console.log(`**** UNABLE TO CONNECT WITH DATABASE ****`);
  console.log(`\n ${err}`);
});

db.once("open", () => {
  console.log("**** CONNECTED WITH DATABASE SUCCESSFULLY ****");
});
