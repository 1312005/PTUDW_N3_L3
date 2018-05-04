const pool = require('../../config/database');

module.exporst = {
    getAll: (id_user, callback) => {
        pool.getConnection(function( err, connection) {
            if (err) throw err;
            else {
                connection.query('SELECT something FROM sometable',  function (error, results, fields) {
                    if (err)
                     callback(err, null)
                     else 
                    callback(null, result.rows);
                });
            }
        });
    }
}