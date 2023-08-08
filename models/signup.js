const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      //   required: [true, "Please provide an email"],
      //   unique: [true, "Username exist"],
    },
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);
const signupModel = mongoose.model("sign-up", signupSchema);
module.exports = signupModel;
