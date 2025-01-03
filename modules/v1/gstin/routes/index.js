const router = require('express').Router();

const controller = require('../controller/index');

router.get('/:gstin', controller.gstinInfo);

module.exports = router;