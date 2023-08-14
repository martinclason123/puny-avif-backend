const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const createZip = async (filePaths) => {
  const compressedFolderPath = path.join(__dirname, "..", "compressed");
  const zipPath = path.join(compressedFolderPath, "output.zip");

  // Create zip
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip");

  archive.pipe(output);

  for (let filePath of filePaths) {
    archive.file(filePath, { name: path.basename(filePath) });
  }

  await archive.finalize();

  // Return zip path
  return zipPath;
};

module.exports = {
  createZip,
};
