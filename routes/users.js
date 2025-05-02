var express = require("express");
var { check_session } = require("../middleware/auth");
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

router.get("/change_passwd", check_session, (req, res) => {
  res.render("manage/change_passwd", {
    title: `Welcome ${req.session.user.name}`,
  });
});

router.post("/change_passwd", check_session, (req, res) => {
  const username = req.session.user.name;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;

  const collection = client.db("my_db").collection("users");
  collection.findOne({ name: username }).then((data) => {
    if (data.password !== old_password) {
      return res.json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    collection.updateOne(
      { name: username },
      { $set: { password: new_password } }
    );
    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  });
});

module.exports = router;
