const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const corsOptionsMiddleware = require("./utils/corsOptionsMiddleware");
const morgan = require("morgan");
const connectDB = require("./utils/connectDB");
const globalErrorsMiddleware = require("./utils/globalErrorsMiddleware");

const app = express();

app.use(cors(corsOptionsMiddleware));

// Development logging
if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}

// Connect to DB
connectDB();

app.use(express.json({ limit: "20kb" }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v1/users", userRoutes);

// Handling global App Errors
app.use(globalErrorsMiddleware);

module.exports = app;
