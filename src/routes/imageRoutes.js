const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/upload",
  upload.array("images"),
  imageController.compressAndZipImages
);

module.exports = router;
