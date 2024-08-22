const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://admin:id@password.8smm5a1.mongodb.net/?retryWrites=true&w=majority&appName=SEBA2024";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
