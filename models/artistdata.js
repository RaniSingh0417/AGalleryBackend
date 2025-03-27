const mongoose = require("mongoose");

const artistdetailSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    artwork: { type: String, required: true },
    arttheme: { type: String },
    arttitle: { type: String, required: true },
    artdescription: { type: String },
  },
  { timestamps: true }
);
const artistModel = mongoose.model("artist_details", artistdetailSchema);
module.exports = artistModel;
