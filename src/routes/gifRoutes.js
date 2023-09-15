// /routes/imageRoutes.js

const express = require("express");
const router = express.Router();
const gifController = require("../controllers/gifController");
const upload = require("../middlewares/uploadMiddleware"); // Importing your middleware

// Using the middleware here
router.post("/", upload.array("images"), gifController.compressAndZipGifs);

module.exports = router;
