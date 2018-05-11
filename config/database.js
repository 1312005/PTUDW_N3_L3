const mysql = require('mysql');

const config  = {
  connectionLimit : 10,
  host            : '127.0.0.1',
  user            : 'drek',
  password        : 'extremelyHardPassEverMade',
  database        : 'electronicshop'
};

const pool = new mysql.createPool(config);

module.exports = pool;