const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const newName = Date.now() + path.extname(file.originalname);
    if (!req.fileMapping) req.fileMapping = {};
    req.fileMapping[newName] = file.originalname; // store the mapping
    cb(null, newName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // limit to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
});

module.exports = upload;
