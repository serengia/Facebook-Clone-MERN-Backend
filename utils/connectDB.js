const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_LINK);
    console.log("Successfully connect to DB!!!");
  } catch (error) {
    console.log("ERROR CONNECTING TO DB!!!");
    console.log("ERROR::", error);
  }
};

module.exports = connectDB;
