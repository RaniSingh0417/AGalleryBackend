const express = require("express");
const app = express();
const artistModel = require("./models/artistdata.js");
const { connectDatabase } = require("./connection/file");
app.use(express.json());

// app.post("/api/");

connectDatabase();
const PORT = 5000;
app.listen(PORT, async () => {
  await console.log(`Server is running at port ${PORT}`);
});
