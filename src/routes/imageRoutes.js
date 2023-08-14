// /routes/imageRoutes.js

const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const upload = require("../middlewares/uploadMiddleware"); // Importing your middleware

// Using the middleware here
router.post("/", upload.array("images"), imageController.compressAndZipImages);

module.exports = router;
