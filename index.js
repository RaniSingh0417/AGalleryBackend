const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cloudinary = require("cloudinary");
const path = require("path");
const upload = require("./handlers/multer");
require("./handlers/cloudinary");
const artistModel = require("./models/artistdata");
const { connectDatabase } = require("./connection/file");
const signupModel = require("./models/signup");

app.use(express.json());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));

app.post(
  "/api/createartistdata",
  upload.single("artwork"),
  async (req, res) => {
    // console.log(req.body, req.file);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      console.log(result);

      const newObject = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        artwork: result.url,
        arttheme: req.body.arttheme,
        arttitle: req.body.arttitle,
        artdescription: req.body.artdescription,
      };
      const artistdata = new artistModel(newObject);
      await artistdata.save();
      return res
        .status(200)
        .json({ success: true, message: "Data saved succefully" });
    } catch (error) {
      return res.status(405).json({ success: false, error: error.message });
    }
  }
);

// Read all art gallery data

app.get("/getartistdata", async (req, res) => {
  try {
    const artistdata = await artistModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: artistdata });
  } catch (error) {
    return res.status(405).json({ success: false, error: error.message });
  }
});
// read single data of art gallery

app.get("/singleart/:id", async (req, res) => {
  try {
    const singleartdata = await artistModel.findById(req.params.id);
    console.log(singleartdata);
    return res.status(200).json({ success: true, data: singleartdata });
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
});

// create signup data
app.post("/api/signupdata", async (req, res) => {
  let count = await signupModel
    .find({
      email: req.body.email,
    })
    .countDocuments();
  let countusername = await signupModel
    .find({
      username: req.body.username,
    })
    .countDocuments();

  try {
    if (count < 1) {
      if (countusername < 1) {
        const newSignup = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        };
        const signupData = new signupModel(newSignup);
        await signupData.save();
        return res
          .status(200)
          .json({ success: true, message: "Thank You! For signing up" });
      } else {
        return res.json({
          success: true,
          message: "Username  exist",
        });
      }
    } else {
      return res.json({
        success: true,
        message: "You already have an account.Please Login",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

//Login
app.get("/login/:username", async (req, res) => {
  try {
    let userdata = await signupModel.findOne({ username: req.params.username });
    return res.status(200).json({ success: true, data: userdata });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
//Delete
app.delete("/deleteart/:id", async (req, res) => {
  try {
    let delArt = await artistModel.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Artwork deleted",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

//Update

app.put(
  "/updateart/:id/:arttheme/:arttitle/:artdescription",
  async (req, res) => {
    try {
      const update = await artistModel.findByIdAndUpdate(req.params.id, {
        arttheme: req.params.arttheme,
        arttitle: req.params.arttitle,
        artdescription: req.params.artdescription,
      });
      return res
        .status(200)
        .json({ success: true, message: "Updated Successfully" });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

connectDatabase();
// const PORT = 5000;
const PORT = process.env.PORT || 5000; //Making port dynamic

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname + "/client/build/index.html"),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
});
app.listen(PORT, async () => {
  await console.log(`Server is running at port ${PORT}`);
});
