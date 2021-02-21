const router = require('express').Router();
const wallet = require('./wallet');

router.use('/wallet',wallet);

module.exports = router;