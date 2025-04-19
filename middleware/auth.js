const check_session = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

const check_session_admin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  if (req.session.user.rule !== 1) {
    return res.status(403).send("Permission denied");
  }
  next();
};
export { check_session, check_session_admin };
