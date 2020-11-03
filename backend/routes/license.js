var express = require('express');
var router = express.Router();

const license = require("../controllers/licenseController");

router.get("/requestPending", license.getRequestPending);

router.get("/", license.findAll);

router.post("/create", license.create);
router.post("/update", license.update);

module.exports = router;
