const mongoose = require("mongoose");
const artistdetailSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    city: { type: String },
    state: { type: String },
    artwork: { data: Buffer, contentType: String },
    arttheme: { type: String },
    artdescription: { type: String },
  },
  { timestamps: true }
);
const artistModel = mongoose.model("artist_details", artistdetailSchema);
module.exports = artistModel;
