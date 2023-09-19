// src/services/gifService.js

const ffmpeg = require("fluent-ffmpeg");
const { exec } = require("child_process");
const path = require("path");

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

// const convertGifToWebP = async (
//   inputFilePath,
//   outputFolderPath,
//   originalFileName
// ) => {
//   const name = path.parse(originalFileName).name;

//   const webpOutputPath = path.join(outputFolderPath, name + ".webp");

//   await new Promise((resolve, reject) => {
//     ffmpeg(inputFilePath)
//       .toFormat("webp")
//       .on("end", resolve)
//       .on("error", reject)
//       .save(webpOutputPath);
//   });

//   return webpOutputPath;
// };

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
    exec(`gif2webp ${inputFilePath} -o ${webpOutputPath}`, (err) => {
      if (err) {
        console.error("Error converting GIF to WebP:", err);
        reject(err);
      } else {
        // Make the WebP loop indefinitely using webpmux
        exec(
          `webpmux -set loop 0 ${webpOutputPath} -o ${webpOutputPath}`,
          (err) => {
            if (err) {
              console.error("Error setting loop for WebP:", err);
              reject(err);
            } else {
              resolve(webpOutputPath);
            }
          }
        );
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
