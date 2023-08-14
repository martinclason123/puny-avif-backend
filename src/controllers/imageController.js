//imageController.js

const imageService = require("../services/imageService");
const zipService = require("../services/zipService");
const path = require("path"); // ensure this is imported at the top of your file

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

    res.download(zippedFilePath);
  } catch (error) {
    console.error("Error in compressAndZipImages:", error.message);
    next(error);
  }
};
