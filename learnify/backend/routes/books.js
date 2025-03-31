const express = require("express");
const fetch = require("node-fetch"); // Ensure node-fetch is installed (npm install node-fetch)
require("dotenv").config();

const router = express.Router();
const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || req.query.query; // Support both "q" and "query"

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${googleBooksApiKey}`;

    const response = await fetch(googleBooksUrl);
    const data = await response.json();

    if (!data.items) {
      return res.status(404).json({ error: "No books found" });
    }

    res.json(data.items);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

module.exports = router;
