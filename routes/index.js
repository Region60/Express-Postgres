const express = require('express');
const router = express.Router();
require('dotenv').config()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../task/doc/swagger.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;
