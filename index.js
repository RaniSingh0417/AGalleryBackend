const express = require("express");
const app = express();
const artistModel = require("./models/artistdata");
const { connectDatabase } = require("./connection/file");
app.use(express.json());

app.post("/api/createartistdata", async (req, res) => {
  try {
    const newObject = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      city: req.body.city,
      state: req.body.state,
      artwork: req.body.artwork,
      arttheme: req.body.arttheme,
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
});

connectDatabase();
const PORT = 5000;
app.listen(PORT, async () => {
  await console.log(`Server is running at port ${PORT}`);
});
