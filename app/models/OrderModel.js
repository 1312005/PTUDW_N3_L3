const baseDAO = require('../dbUtil/baseDAO');
//const utils = require('../utils/orderNumberGenarator');

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

exports.add = (orderNumber, cart, discount, memberId) => {

    let order = {
        orderNumber: orderNumber,
        discount: discount || 0.0,
    };
    order.totalAmount = cart.totalPrice*(1 - order.discount);
    let sqlOrder = `INSERT INTO orders(orderId, totalAmount, discount, memberId) VALUES('${order.orderNumber}', ${order.totalAmount}, ${order.discount}, ${memberId})`;
    return baseDAO.save(sqlOrder);
}