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

  const compressedGifOutputPath = path.join(outputFolderPath, name + ".gif");

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

const convertGifToWebP = async (
  inputFilePath,
  outputFolderPath,
  originalFileName
) => {
  const name = path.parse(originalFileName).name;

  const webpOutputPath = path.join(outputFolderPath, name + ".webp");

  await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .toFormat("webp")
      .on("end", resolve)
      .on("error", reject)
      .save(webpOutputPath);
  });

  return webpOutputPath;
};

const convertGifToMP4 = async (
  inputFilePath,
  outputFolderPath,
  originalFileName
) => {
  const name = path.parse(originalFileName).name;

  const mp4OutputPath = path.join(outputFolderPath, name + ".mp4");

  await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .toFormat("mp4")
      .videoCodec("libx264")
      .on("end", resolve)
      .on("error", reject)
      .save(mp4OutputPath);
  });

  return mp4OutputPath;
};

module.exports = {
  compressGif,
  convertGifToWebM,
  convertGifToMP4,
  convertGifToWebP,
};
