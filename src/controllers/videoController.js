const fs = require("fs-extra"); // Use fs-extra for additional utility
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
console.log("ffmpegPath:", ffmpegPath);
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const gifService = require("../services/gifService");
const zipService = require("../services/zipService");
const cleanupService = require("../services/cleanupService");

exports.compressAndZipGifs = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      console.log("Error: No files uploaded.");
      throw new Error("No files uploaded");
    }

    // Ensure the compressed directory
    const compressedDirectory = "/tmp/compressed";
    await fs.ensureDir(compressedDirectory);

    const convertedFilePaths = []; // Store all converted file paths here

      for(let gif of req.files) {
      console.log(`Compressing and converting GIF: ${gif.originalname}`);

      // Convert GIF to WebM
      const webmPath = await gifService.convertGifToWebM(
        gif.path,
        compressedDirectory,
        gif.originalname
      );

      //Convert GIF to MP4
      const mp4Path = await gifService.convertGifToMP4(
        gif.path,
        compressedDirectory,
        gif.originalname
      );

      convertedFilePaths.push(webmPath, mp4Path);
      }

    console.log("All GIFs converted successfully.");
    console.log("Creating zip file.");
    const zippedFilePath = await zipService.createZip(convertedFilePaths);
    console.log("Zip file created successfully.");

    const stream = fs.createReadStream(zippedFilePath);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${path.basename(zippedFilePath)}`
    );
    stream.pipe(res);

    // Cleanup after the response is finished
    res.on("finish", async () => {
      console.log("Cleaning up the compressed directory...");
      await cleanupService.cleanupService(compressedDirectory);
      console.log("Cleanup done!");
    });
  } catch (error) {
    console.error("Error in compressAndZipGifs:", error.message);
    next(error);
  }
};
