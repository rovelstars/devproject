module.exports = async function (req, res, next) {
  if (req.header("worker") != "true") {
    res.render("worker.ejs", { req });
  } else {
    next();
  }
};
