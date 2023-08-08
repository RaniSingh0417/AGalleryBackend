const mongoose = require("mongoose");
const artistdetailSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },

    artwork: { type: String },
    arttheme: { type: String },
    arttitle: { type: String },
    artdescription: { type: String },
  },
  { timestamps: true }
);
const artistModel = mongoose.model("artist_details", artistdetailSchema);
module.exports = artistModel;
