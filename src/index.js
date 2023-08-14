const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/imageRoutes");
const errorHandler = require("./middlewares/errorHandlerMiddleware");

const app = express();

app.use(cors());

// Add routes
app.use("/api/images", imageRoutes);

// Add error handler (this should always be the last middleware before starting the server)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
