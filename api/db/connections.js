const mysql = require('mysql2/promise');

const connect = () => {
  const {
    DB_HOST, BINGO_DB_NAME, DB_USER, DB_PASS,
  } = process.env;
  return mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: BINGO_DB_NAME,
  });
};

const connectPool = () => {
  const {
    DB_HOST, BINGO_DB_NAME, DB_USER, DB_PASS,
  } = process.env;
  return mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: BINGO_DB_NAME,
  });
};

exports.connect = connect;
exports.connectPool = connectPool;
