const router = require('express').Router();

router.get("/", (req, res) => res.render("dashboard/index"));

module.exports = router;