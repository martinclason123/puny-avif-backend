// src/services/gifService.js

const ffmpeg = require("fluent-ffmpeg");
const { exec } = require("child_process");
const path = require("path");

const compressGif = (inputFilePath, outputFolderPath, originalFileName) => {
  return new Promise((resolve, reject) => {
    const name = path.parse(originalFileName).name;
    const compressedGifOutputPath = path.join(outputFolderPath, name + ".gif");

    // Use gifsicle to compress the GIF
    const command = `gifsicle --optimize=3 --colors 128 --lossy=30 "${inputFilePath}" -o "${compressedGifOutputPath}"`;

    exec(command, (error) => {
      if (error) {
        console.error(`Error compressing GIF with gifsicle: ${error}`);
        reject(error);
      } else {
        resolve(compressedGifOutputPath);
      }
    });
  });
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

const convertGifToWebP = (
  inputFilePath,
  outputFolderPath,
  originalFileName
) => {
  return new Promise((resolve, reject) => {
    const absoluteInputFilePath = path.resolve(inputFilePath);
    console.log("Absolute Input File Path:", absoluteInputFilePath);

    const name = path.parse(originalFileName).name;
    const webpOutputPath = path.join(outputFolderPath, name + ".webp");

    // Convert the GIF to WebP using gif2webp
    exec(`gif2webp -lossy ${inputFilePath} -o ${webpOutputPath}`, (err) => {
      if (err) {
        console.error("Error converting GIF to WebP:", err);
        reject(err);
      } else {
        resolve(webpOutputPath);
      }
    });
  });
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
