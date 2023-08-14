// index.js

const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/imageRoutes");
const errorHandler = require("./middlewares/errorHandlerMiddleware");

const app = express();

app.use(cors());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
});

// Check if routes are loaded
app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

// Add routes
app.use("/api/images", imageRoutes);

// Handle 404s
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Add error handler (this should always be the last middleware before starting the server)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
