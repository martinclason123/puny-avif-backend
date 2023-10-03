// uploadMiddleware.js

// Require necessary modules
const multer = require("multer");
const path = require("path");

// Set storage options for multer. This controls where and how the uploaded files are saved.
const storage = multer.diskStorage({
  // Define the destination for the uploaded files.
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },

  // Define the naming convention for the uploaded files.
  filename: (req, file, cb) => {
    // Prefix the file name with the current timestamp for uniqueness, and append its original extension.
    const newName = Date.now() + path.extname(file.originalname);

    // Map the new name to the original name (useful for future reference).
    if (!req.fileMapping) req.fileMapping = {};
    req.fileMapping[newName] = file.originalname;

    cb(null, newName);
  },
});

// Configure the upload middleware
const upload = multer({
  // Use the previously defined storage options.
  storage: storage,

  // Set a file size limit to prevent overly large uploads.
  limits: { fileSize: 10000000 }, // 5MB limit

  // Filter which files are allowed to be uploaded based on file type.
  fileFilter: (req, file, cb) => {
    // Allowed filetypes: jpeg, jpg, png, and gif
    const filetypes = /jpeg|jpg|png|gif/;

    // Check if the mimetype of the file is one of the allowed types.
    const mimetype = filetypes.test(file.mimetype);

    // Check if the file extension is one of the allowed types.
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // If both the mimetype and the extension are valid, proceed.
    if (mimetype && extname) {
      return cb(null, true);
    }

    // If either check fails, return an error.
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
});

// Export the upload middleware to be used in other parts of the application.
module.exports = upload;
