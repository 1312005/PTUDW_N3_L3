// ppu : price per unit
 // ttp: total price
exports.add = (orderNumber,productId, ppu, ttp,discount, qty) => {

    let detail = {
        orderNumber: orderNumber,
        discount: discount || 0.0,
        ppu: ppu,
        qty: qty
    };
    detail.totalAmount = ppu*(1-detail.discount)*qty;
    oder.totalAmount = cart.totalPrice*(1 - order.discount);
    let sqlDetails = `INSERT INTO orderDetails(orderId, totalAmount, discount, price_per_unit,productQuantity) VALUES('${detail.orderNumber}', ${detail.totalAmount}, ${detail.discount}, ${detail.ppu}, ${detail.qty})`;
    return baseDAO.save(sqlDetails);
}