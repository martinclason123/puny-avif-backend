const sharp = require("sharp");
const path = require("path");

const QUALITY = 80;
const AVIF_QUALITY = Math.floor(QUALITY * 0.7);
const COMPRESSION_LEVEL = Math.floor(QUALITY / 10);

const compressImage = async (inputFilePath, outputFolderPath) => {
  const { ext, name } = path.parse(inputFilePath);
  const outputPath = path.join(outputFolderPath, name + ext);

  const image = sharp(inputFilePath);

  if (ext.toLowerCase() === ".jpg" || ext.toLowerCase() === ".jpeg") {
    await image.jpeg({ quality: QUALITY }).toFile(outputPath);
  } else if (ext.toLowerCase() === ".png") {
    await image.png({ compressionLevel: COMPRESSION_LEVEL }).toFile(outputPath);
  }

  // Add more formats if needed

  return outputPath; // return path of the compressed image
};

module.exports = {
  compressImage,
};
