require("dotenv").config();
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const User = require("./model/user"); // Assuming your model is in ./model/user.js

const app = express();

// Configuration
const PORT = process.env.PORT || 9000;
const JWT_SECRET = process.env.JWT_SECRET || "sss"; // Use environment variable for secret
const SALT_ROUNDS = 10;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
  console.log(req.headers);
  res.render("index");
});

app.post("/create", async (req, res) => {
  try {
    const { name, age, email, mobile } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User already registered"); // Use appropriate status code
    }

    const hashedPassword = await bcrypt.hash(age, SALT_ROUNDS);
    const newUser = await User.create({
      name,
      age: hashedPassword,
      email,
      mobile,
    });

    const token = jwt.sign({ email: email }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Set secure flag in production
    res.status(201).send("We will get in touch soon"); // Use 201 for resource creation

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal server error"); // Handle errors gracefully
  }
});

app.post("/upload", upload.single("imagefile"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.redirect("/");
});

// Error Handling Middleware (Optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server Start
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));