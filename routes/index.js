var express = require("express");
const { check_session } = require("../middleware/auth");
var router = express.Router();

/* GET home page. */
router.get("/", check_session, (req, res, next) => {
  res.render("index", {
    title: `Welcome ${req.session.user.name}`,
    admin: req.session.user.rule == 1,
  });
});

module.exports = router;
