const fs = require("fs-extra"); // Use fs-extra for additional utility
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const gifService = require("../services/gifService");
const zipService = require("../services/zipService");
const cleanupService = require("../services/cleanupService");

exports.compressAndZipGifs = async (req, res, next) => {
  try {
    console.log("Entered compressAndZipGifs function.");

    if (!req.files || req.files.length === 0) {
      console.log("Error: No files uploaded.");
      throw new Error("No files uploaded");
    }

    // Ensure the compressed directory
    const compressedDirectory = "/tmp/compressed";
    await fs.ensureDir(compressedDirectory);

    const gif = req.files[0];
    console.log(`Compressing and converting GIF: ${gif.originalname}`);

    // Compress the GIF
    const compressedGifPath = await gifService.compressGif(
      gif.path,
      compressedDirectory,
      gif.originalname
    );

    // Convert GIF to WebM
    const webmPath = await gifService.convertGifToWebM(
      gif.path,
      compressedDirectory,
      gif.originalname
    );

    console.log("Creating zip file.");
    const zippedFilePath = await zipService.createZip([
      compressedGifPath,
      webmPath,
    ]);
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
