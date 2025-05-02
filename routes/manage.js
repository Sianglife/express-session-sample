var express = require("express");
const { check_session_admin } = require("../middleware/auth");
var router = express.Router();

// MongoDB connection
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB;
const client = new MongoClient(uri);

// ROOT: /manage

router.get("/add", check_session_admin, (req, res) => {
  res.render("manage/add", { name: req.session.user.name });
});


router.post("/add", check_session_admin, (req, res) => {
  const admin = req.session.user.name;
  const collection = client.db("my_db").collection("users");
  collection.findOne({ name: admin }).then((data) => {
    if (!data) {
      return res
        .json({
          success: false,
          message: "Not Authorized",
        })
        .redirect("/auth/logout");
    }
  });

  const username = req.body.username;
  const password = req.body.password;
  const rule = req.body.rule;

  try {
    // check if user exists
    client
      .db("my_db")
      .collection("users")
      .findOne({ name: username })
      .then((data) => {
        if (data) {
          return res.json({
            success: false,
            message: "User already exists",
          });
        }
      });
    client
      .db("my_db")
      .collection("users")
      .insertOne({
        name: username,
        password: password,
        rule: rule,
      })
      .then(() => {
        res.json({
          success: true,
          message: "User added successfully",
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to add user",
    });
  }
});

module.exports = router;
