const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");

const app = express();

// Development logging
if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "20kb" }));

app.use("/api/v1/users", userRoutes);

module.exports = app;
