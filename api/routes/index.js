const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (_req, res) => {
  res.json({ title: 'Express' });
});

module.exports = router;
