// src/services/gifService.js

const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs-extra");

const compressGif = async (
  inputFilePath,
  outputFolderPath,
  originalFileName
) => {
  const name = path.parse(originalFileName).name;

  const compressedGifOutputPath = path.join(
    outputFolderPath,
    name + "-compressed.gif"
  );

  // Use FFmpeg to compress the GIF (you'll need to adjust flags for optimal compression)
  await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .outputOptions("-vf", "scale=320:-1")
      .toFormat("gif")
      .on("end", resolve)
      .on("error", reject)
      .save(compressedGifOutputPath);
  });

  return compressedGifOutputPath;
};

const convertGifToWebM = async (
  inputFilePath,
  outputFolderPath,
  originalFileName
) => {
  const name = path.parse(originalFileName).name;

  const webmOutputPath = path.join(outputFolderPath, name + ".webm");

  await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .toFormat("webm")
      .on("end", resolve)
      .on("error", reject)
      .save(webmOutputPath);
  });

  return webmOutputPath;
};

module.exports = {
  compressGif,
  convertGifToWebM,
};
