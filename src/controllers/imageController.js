const imageService = require("../services/imageService");
const zipService = require("../services/zipService");

exports.compressAndZipImages = async (req, res, next) => {
  try {
    if (!req.files) {
      throw new Error("No files uploaded");
    }

    const compressedFilePaths = [];

    for (let file of req.files) {
      const compressedFilePath = await imageService.compressImage(
        file.path,
        path.join(__dirname, "..", "compressed")
      );
      compressedFilePaths.push(compressedFilePath);
    }

    const zippedFilePath = await zipService.createZip(compressedFilePaths);
    res.download(zippedFilePath);
  } catch (error) {
    next(error);
  }
};
