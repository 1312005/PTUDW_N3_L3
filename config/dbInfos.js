const mysql = require('mysql');

const config  = {
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.USER_STANDARD,
  password        : process.env.DB_PASS_STANDARD,
  database        : process.env.DB_NAME
};

const pool = new mysql.createPool(config);

module.exports = pool;