var baseDAO = require('../dbUtil/baseDAO');

exports.fetchList = (provinceId) => {
    var sql = `SELECT * FROM cities where provinceId = ${provinceId}`;
    return baseDAO.load(sql);
}