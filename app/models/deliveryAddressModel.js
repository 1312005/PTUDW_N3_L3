var baseDAO = require('../dbUtil/baseDAO');


// add devivery address for the order
const add = (addr)  => {
	let sql = `INSERT INTO deliveryAddresses(orderId, phoneNumber, deliveryDistrict, deliveryAddress) 
			   VALUES('${addr.orderId}', '${addr.phoneNumber}', ${addr.TownId}, '${addr.Street}')`;
    return baseDAO.save(sql);
}

module.exports = { add };