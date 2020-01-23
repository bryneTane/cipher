var express = require('express');
var router = express.Router();

/* GET methods page. */
router.get('/', function (req, res, next) {
    res.render('methods', { title: 'Express' });
});


module.exports = router;
