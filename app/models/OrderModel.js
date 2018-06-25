const baseDAO = require('../dbUtil/baseDAO');
const config = require('../../config/config');
//const utils = require('../utils/orderNumberGenarator');

// orderby Date, status

exports.fetchAllBelongTo = (id) => {
        let sql = `SELECT * FROM orders WHERE memberId = ${id} order by created_at`;    
        return  baseDAO.load(sql);
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

exports.getProductDetail = (orderNumber) => {
    let sql = `select d.discount,d.productQuantity,d.totalAmount,d.price_per_unit,
               p.productName
               from orderdetails d, products p  
               where orderId = '${orderNumber}' AND d.productId = p.id`;

   return baseDAO.load(sql);
}

exports.getGenericDetail = (orderNumber) => {
    let sql = `select m.firstName, m.lastName,
	   o.orderId, o.created_at, o.discount, o.state, o.totalAmount,
       p.provinceName as province,
       c.cityName  as city,
       l.deliveryAddress
	   from orders o,
	   members m,
       deliveryaddresses l,
        cities c,
        provinces p
       where o.orderId = '${orderNumber}'
	  AND m.memberId = o.memberId
      AND l.orderId = o.orderId
      AND l.deliveryDistrict = c.cityId
      AND c.provinceId = p.provinceId;`;

   return baseDAO.load(sql);

exports.loadAllOrders = (offset)=>{
    let sql = `select * from orders INNER JOIN members mb ON orders.memberId = mb.memberId INNER JOIN limit ${config.ORDER_PER_PAGE} offset ${offset}`;
    return baseDAO.load(sql);
}

exports.countOrders = ()=>{
    let sql = `select count(*) as total from orders `;
    return baseDAO.load(sql);
}