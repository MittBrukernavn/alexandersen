const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

const adminOnly = (req, res, next) => {
  try {
    const { headers } = req;
    const { Authorization } = headers;
    if (Authorization && Authorization.startsWith('Bearer ')) {
      const token = Authorization.substring(7);
      jwt.verify(token, JWT_KEY);
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.sendStatus(401);
  }
};

// todo: implement other users
const userOnly = () => {

};

exports.adminOnly = adminOnly;
exports.userOnly = userOnly;
