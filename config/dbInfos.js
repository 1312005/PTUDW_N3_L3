const mysql = require('mysql');

const config  = {
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_NAME
};

const pool = new mysql.createPool(config);

module.exports = pool;