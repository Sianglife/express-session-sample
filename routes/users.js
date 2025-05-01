var express = require("express");
var fileUpload = require("express-fileupload");
var router = express.Router();

const UPLOAD_FOLDER = "./public/upload/";

const URI = process.env.MONGODB;
const { MongoClient } = require("mongodb");
const client = new MongoClient(URI);

router.use(fileUpload());

router.get("/info", (req, res) => {
  const username = req.session.user.name;
  res.render("manage/info", { img: `/upload/${username}` });
});

/* POST upload and record to DB */
router.post("/upload", async (req, res) => {
  const username = req.session.user.name;
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    console.log(username);
    const file = req.files.file;
    file.mv(UPLOAD_FOLDER + username);
    res.redirect("/");
  } catch (err) {
    console.error("Error during file upload:", err);
    res.status(500).send("An error occurred during the upload.");
  }
});


module.exports = router;
