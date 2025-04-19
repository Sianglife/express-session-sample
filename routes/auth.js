var express = require("express");
var router = express.Router();

// Root: /auth

// MongoDB connection
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB;
const client = new MongoClient(uri);

router.get("/", (req, res, next) => {
  res.redirect("/auth/login");
});

/* GET login page. */
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/logout", (req, res, next) => {
  req.session.user = null;
  res.redirect("/");
});

router.post("/login", (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  console.log("Login attempt: ", name, password);
  // validate username and password
  if (!name || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    client.connect();
    client
      .db("my_db")
      .collection("users")
      .findOne(
        { name: name },
        { projection: { _id: 0, name: 1, password: 1, rule: 1 } }
      )
      .then((data) => {
        if (!data) {
          return res.json({
            success: false,
            message: "Invalid username or password",
          });
        }
        if (data.password !== password) {
          return res.json({
            success: false,
            message: "Invalid username or password",
          });
        }
        req.session.user = {
          name: data.name,
          rule: data.rule,
        };
        res.json({
          success: true,
          message: "Login successful",
        });
      });
  } catch (e) {
    console.error("Error logging in: ", e);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
