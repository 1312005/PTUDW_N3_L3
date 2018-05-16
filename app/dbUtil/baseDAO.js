const pool = require('../../config/database');

exports.load = (sql) => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			if (err) {
				//connection.release();
				reject(err)
			}
			else {

				console.log('establish connection');

				connection.query(sql, function(error, rows, fields) {
					connection.release();
					console.log('release connection');
					if (error) {
						reject(error)
					}
					else {
						resolve(rows);
					}

				});
			}
	});
});
}

exports.save = sql => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				reject(err)
			}
			else {

				console.log('establish connection');
				
				connection.query(sql, function(error, value) {
					
					connection.release();

					console.log('release connection');
					if (error) {
						reject(error)
					}
					else {
						resolve(value);
					}
				});
			}
		});
});
}