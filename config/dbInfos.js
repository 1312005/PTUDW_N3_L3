const mysql = require('mysql');

const config  = {
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'MyNewPass',
  database: 'electronicshop'
};

const pool = new mysql.createPool(config);

module.exports = pool;