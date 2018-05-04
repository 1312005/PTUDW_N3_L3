var mysql = require('mysql');

var config  = {
  connectionLimit : 10,
  host            : '127.0.0.1',
  user            : 'bob',
  password        : 'secret',
  database        : 'electronicshop'
};

const pool = new mysql.createPool(config);

module.exports = pool;