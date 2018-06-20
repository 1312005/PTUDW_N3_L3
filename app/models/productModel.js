'use stric'
const config = require('../../config/config.js');
const dbDAO = require('../dbUtil/baseDAO');

// exports.loadAllProduct = () => {
//     let sql = 'select * from products pr, image img where pr.id = img.productId and img.isAvatar = true';
//     return dbDAO.load(sql);
// }

exports.single = (id) =>{
    return new Promise((resolve, reject) => {
        let sql = `select * from products pr, manufacturers mf where id = ${id} and pr.manufacturerId = mf.manufacturerId`;
        console.log(sql);
        dbDAO.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            } else {
                resolve(rows[0]);
                console.log("Data trả về: ");
                console.log(rows);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

exports.loadDescription = (id) =>{
    let sql = 'SELECT description FROM products';
    return dbDAO.load(sql);
}
exports.loadAllImage = () =>{
    let sql = 'SELECT * FROM image';
    return dbDAO.load(sql);
}

/* Home */
exports.loadTopView = ()=>{
    let sql = 'SELECT id,productName,imagePath,price FROM products ORDER BY views DESC limit 10';
    return dbDAO.load(sql);
}

exports.loadTopNew = () => {
    let sql = 'SELECT id,productName,imagePath,price FROM products ORDER BY updatedDate DESC limit 10';
    return dbDAO.load(sql);
}

/*Shop Page*/
exports.loadAllProduct = (offset)=>{
    let sql = `select * from products limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return dbDAO.load(sql);
}

exports.countProduct = ()=>{
    let sql = 'select count (*) as total from products';
    return dbDAO.load(sql);
}

exports.updateView = (idProduct, newView)=>{
    let sql = `update products set views = ${newView} where products.id = ${idProduct}`;
    return dbDAO.save(sql);
}

/*Search */
exports.searchProduct = (nameProduct)=>{
    let sql = `select * from products where products.productName like '%${nameProduct}%'`;
    return dbDAO.load(sql);
}