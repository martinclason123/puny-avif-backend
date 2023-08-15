const fs = require("fs-extra"); // Use fs-extra for additional utility
const imageService = require("../services/imageService");
const zipService = require("../services/zipService");
const cleanupService = require("../services/cleanupService");
const path = require("path");

exports.compressAndZipImages = async (req, res, next) => {
  try {
    console.log("Entered compressAndZipImages function.");

    if (!req.files) {
      console.log("Error: No files uploaded.");
      throw new Error("No files uploaded");
    }

    // Set the compressed directory to a temporary path and ensure it exists
    const compressedDirectory = "/tmp/compressed";
    await fs.ensureDir(compressedDirectory);

    console.log(`Processing ${req.files.length} files.`);
    const compressedFilePaths = [];

    for (let file of req.files) {
      console.log(`Compressing file: ${file.originalname}`);
      const compressedFiles = await imageService.compressImage(
        file.path,
        compressedDirectory,
        file.originalname // passing the original filename
      );

      compressedFilePaths.push(...compressedFiles); // Using spread to append multiple items
      console.log(`File ${file.originalname} compressed.`);
    }

    console.log("Creating zip file.");
    const zippedFilePath = await zipService.createZip(compressedFilePaths);
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
    console.error("Error in compressAndZipImages:", error.message);
    next(error);
  }
};
