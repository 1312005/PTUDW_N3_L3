const pool = require('../../config/database');

exports.load = (sql) => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			if (err) {
				reject(error)
			}
			else {

				console.log('establish connection');

				connection.query(sql, function(error, rows, fields) {
					if (error) {
						reject(error)
					}
					else {
						resolve(rows);
					}

					connection.release();

					console.log('release connection');
				});
			}
	});
});
}

exports.save = sql => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				reject(error)
			}
			else {

				console.log('establish connection');
				
				connection.query(sql, function(error, value) {
					if (error) {
						reject(error)
					}
					else {
						resolve(rows);
					}

					connection.release();

					console.log('release connection');
				});
			}
		});
});
}