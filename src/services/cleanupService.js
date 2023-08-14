// src/services/cleanupService.js

const fs = require("fs").promises;
const path = require("path");

const cleanupService = async (dirPath) => {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    await fs.unlink(filePath); // Delete the file
  }
};

module.exports = {
  cleanupService,
};
