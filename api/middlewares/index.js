const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

const adminOnly = (req, res, next) => {
  console.log('Admin login');
  try {
    const { body } = req;
    const { token } = body;
    jwt.verify(token, JWT_KEY);
    next();
  } catch (e) {
    res.sendStatus(401);
  }
};

// todo: implement other users
const userOnly = () => {

};

exports.adminOnly = adminOnly;
exports.userOnly = userOnly;
