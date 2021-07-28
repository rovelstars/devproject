var router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ hello: "world" });
});
router.get("/login", (req, res) => {
  /*
   * afterwards
   */
});

module.exports = router;
