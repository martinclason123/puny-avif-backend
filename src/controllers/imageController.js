const fs = require("fs");
const imageService = require("../services/imageService");
const zipService = require("../services/zipService");
const path = require("path");

exports.compressAndZipImages = async (req, res, next) => {
  try {
    console.log("Entered compressAndZipImages function.");

    if (!req.files) {
      console.log("Error: No files uploaded.");
      throw new Error("No files uploaded");
    }

    console.log(`Processing ${req.files.length} files.`);
    const compressedFilePaths = [];

    for (let file of req.files) {
      console.log(`Compressing file: ${file.originalname}`);
      const compressedFilePath = await imageService.compressImage(
        file.path,
        path.join(__dirname, "..", "compressed")
      );
      compressedFilePaths.push(compressedFilePath);
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
  } catch (error) {
    console.error("Error in compressAndZipImages:", error.message);
    next(error);
  }
};
