// src/services/imageService.js
const sharp = require("sharp");
const path = require("path");

const QUALITY = 80;
const AVIF_QUALITY = Math.floor(QUALITY * 0.7);
const COMPRESSION_LEVEL = Math.floor(QUALITY / 10);

const compressImage = async (
  inputFilePath,
  outputFolderPath,
  originalFileName
) => {
  const { ext } = path.parse(inputFilePath);
  const image = sharp(inputFilePath);

  // Use the name from originalFileName for compressed files
  const name = path.parse(originalFileName).name;

  let outputPathList = [];

  // Generate JPEG, WebP, and AVIF for JPEG input
  if (ext.toLowerCase() === ".jpg" || ext.toLowerCase() === ".jpeg") {
    const jpegOutputPath = path.join(outputFolderPath, name + ".jpg");
    await image.jpeg({ quality: QUALITY }).toFile(jpegOutputPath);
    outputPathList.push(jpegOutputPath);
  }

  // Generate PNG for PNG input
  if (ext.toLowerCase() === ".png") {
    const pngOutputPath = path.join(outputFolderPath, name + ".png");
    await image
      .png({ compressionLevel: COMPRESSION_LEVEL })
      .toFile(pngOutputPath);
    outputPathList.push(pngOutputPath);
  }

  // Generate WebP for both JPEG and PNG input
  const webpOutputPath = path.join(outputFolderPath, name + ".webp");
  await image.clone().webp({ quality: QUALITY }).toFile(webpOutputPath);
  outputPathList.push(webpOutputPath);

  // Generate AVIF for both JPEG and PNG input
  const avifOutputPath = path.join(outputFolderPath, name + ".avif");
  await image.clone().avif({ quality: AVIF_QUALITY }).toFile(avifOutputPath);
  outputPathList.push(avifOutputPath);

  return outputPathList;
};

module.exports = {
  compressImage,
};
