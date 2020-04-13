const router = require("express").Router();

router.use("/v1", require("./app"));

module.exports = router;