const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const artistModel = require("./models/artistdata");
const { connectDatabase } = require("./connection/file");
const signupModel = require("./models/signup");
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post(
  "/api/createartistdata",
  upload.single("artwork"),
  async (req, res) => {
    console.log(req.body, req.file, req.file.path);
    try {
      const newObject = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        artwork: req.file.path,
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
      return res.status(401).json({ success: false, error: error.message });
    }
  }
);

// Read all art gallery data

app.get("/getartistdata", async (req, res) => {
  try {
    const artistdata = await artistModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: artistdata });
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
});
// read single data of art gallery

app.get("/singleart/:id", async (req, res) => {
  try {
    const singleartdata = await artistModel.findById(req.params.id);
    console.log(singleartdata);
    return res.status(200).json({ success: true, data: singleartdata });
  } catch (error) {
    returnres.status(401).json({ success: false, error: error.message });
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

connectDatabase();
const PORT = 5000;
app.listen(PORT, async () => {
  await console.log(`Server is running at port ${PORT}`);
});
