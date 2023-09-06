const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://rs170504singh:xC01oWBXjjfWfWYQ@cluster0.d6l0joa.mongodb.net/?retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("Database Connected");
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { connectDatabase };
