const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cookies = require("cookie-parser");
const cloudinary = require("cloudinary");
const path = require("path");
const upload = require("./handlers/multer");
require("./handlers/cloudinary");
const artistModel = require("./models/artistdata");
const { connectDatabase } = require("./connection/file");
const { encryptPassword } = require("./functions/encrypt");
const { verifyPassword } = require("./functions/verifypassword");
const { generateToken } = require("./tokens/generateToken");
const { verifyToken } = require("./tokens/verifyToken");
const signupModel = require("./models/signup");
const { error } = require("console");

app.use(express.json());
app.use(cookies());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));

// Signup
app.post("/api/signupdata", async (req, res) => {
  try {
    let checkusername = await signupModel.findOne({
      username: req.body.username.toLowerCase(),
    });
    if (checkusername) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exist" });
    }

    let useremail = req.body.email;
    let checkemail = await signupModel.findOne({
      email: useremail.toLowerCase(),
    });
    // console.log(email.toLowerCase());
    if (checkemail) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exist" });
    }

    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(req.body.email)) {
      const signup = {
        username: req.body.username,
        email: req.body.email,
        password: await encryptPassword(req.body.password),
      };
      const signupdata = new signupModel(signup);
      await signupdata.save();
      return res.json({ success: true, message: "Thank You! For signing up" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Pls enter a valid emailid" });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Login APi

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const userdata = await signupModel.findOne({ username: username });

    if (!userdata) {
      return res
        .status(400)
        .json({ success: "false", error: "Account doesn't exist" });
    }
    // verifying password

    const encryptedPassword = userdata.password;
    const inputPassword = req.body.password;
    if (await verifyPassword(inputPassword, encryptedPassword)) {
      const token = generateToken(userdata._id);
      res.cookie("auth_tk", token);
      return res.json({ success: true, message: "Logged in successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect password" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

const checkIfUserLoggedIn = (req, res, next) => {
  console.log(req.cookies.auth_tk);
  if (verifyToken(req.cookies.auth_tk)) {
    const userinfo = verifyToken(req.cookies.auth_tk);
    console.log(userinfo);
    req.userid = userinfo.id;
    console.log("Hi this is middleware function");
    console.log(userinfo);

    next();
  } else {
    return res
      .status(400)
      .json({ success: false, error: "Login to your account" });
  }
};

app.post(
  "/api/createartistdata",
  checkIfUserLoggedIn,
  upload.single("artwork"),
  async (req, res) => {
    try {
      if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(req.body.email)) {
        const userid = req.userid;
        const userdetails = await signupModel.findOne(
          { _id: userid },
          { email: 1 }
        );
        if (req.body.email === userdetails.email) {
          const result = await cloudinary.v2.uploader.upload(req.file.path);
          // console.log(result);
          const newObject = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            artwork: result.secure_url,
            arttheme: req.body.arttheme,
            arttitle: req.body.arttitle,
            artdescription: req.body.artdescription,
          };
          const artistdata = new artistModel(newObject);
          await artistdata.save();
          return res
            .status(200)
            .json({ success: true, message: "Data saved successfully" });
        } else {
          return res
            .status(400)
            .json({ success: false, error: "Use registered Email-Id " });
        }
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Enter valid Email-id" });
      }
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
