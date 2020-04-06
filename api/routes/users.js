const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');

/* Log in (as admin) */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { ADMIN_USER, ADMIN_PASS, JWT_KEY } = process.env;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ foo: '_b_a_r_____' }, JWT_KEY, { expiresIn: 1800 });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
