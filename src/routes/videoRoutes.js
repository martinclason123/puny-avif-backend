// /routes/imageRoutes.js

const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const upload = require("../middlewares/uploadMiddleware"); // Importing your middleware

// Using the middleware here
router.post("/", upload.array("images"), videoController.compressAndZipGifs);

module.exports = router;