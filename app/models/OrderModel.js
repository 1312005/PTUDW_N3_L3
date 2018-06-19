const baseDAO = require('../dbUtil/baseDAO');

// orderby Date, status

exports.fetchByproperty = (options) => {
     return new Promise((resolve, reject) => {
        let query;
	if (options.status)
	{
		sql = `SELECT * FROM orders WHERE status = '${options.status}' order by created_at`;
	}
	else {
		sql = `SELECT * FROM orders order by created_at`;
	}
        baseDAO.load(sql)
               .then(rows => {
                    if (rows.length == 0) {
                        resolve(null);
                    }
                    else {
                        resolve(rows[0]);
                    } })
                .catch(err => {
                    reject(err);
        });
    });
}