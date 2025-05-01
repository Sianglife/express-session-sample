var express = require("express");
var router = express.Router();

const URI = process.env.MONGODB;
const { MongoClient } = require("mongodb");
const client = new MongoClient(URI);

//ROOT: /auth

// path: /auth/
router.get("/", (req, res, next) => {
  res.redirect("/auth/login");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/"); // path: /
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  try {
    client.connect();
    client
      .db("my_db")
      .collection("users")
      .findOne({ name: name })
      .then((data) => {
        if (!data) {
          return res.json({
            success: false,
            message: "Invalid login data",
          });
        }
        if (data.password != password) {
          return res.json({
            success: false,
            message: "Invalid login data",
          });
        }
        req.session.user = {
          name: data.name,
        };
        res.json({ success: true });
      });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
