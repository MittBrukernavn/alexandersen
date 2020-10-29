const express = require('express');

const { adminOnly } = require('../middlewares');

const dotmocracies = require('../states/dotmocracies');

const router = express.Router();

router.use(adminOnly);

router.get('/', (_req, res) => {
  res.json(dotmocracies);
});

module.exports = router;
