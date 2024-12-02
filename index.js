require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const { validateURL } = require("./utils");
const URL = require("./models/urlModel");
const shortid = require("shortid");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next(); // Pass control to the next middleware or route handler
});
// Connect to MongoDB
connectDB();

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.post("/api/shorturl", async (req, res) => {
  try {
    const url = req.body.url;

    // Validate the URL
    if (!validateURL(url)) {
      return res.status(422).json({ error: "invalid url" });
    }

    const doc = await URL.findOne({ originalUrl: url });

    if (doc) {
      return res.status(409).json({
        message: "URL already exists",
        original_url: doc.originalUrl,
        short_url: doc.shortUrl,
      });
    }

    // Create a new document
    const shortUrl = shortid.generate(); // Generate a unique short URL
    const newDoc = new URL({
      originalUrl: url,
      shortUrl,
    });

    await newDoc.save(); // Save to the database

    // Respond with the shortened URL
    res.status(200).json({
      message: "URL shortened successfully",
      original_url: url,
      short_url: shortUrl,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/shorturl/:shortUrl", async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;

    const doc = await URL.findOne({ shortUrl });

    if (!doc) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.redirect(doc.originalUrl);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
