'use stric'
const dbDAO = require('../dbUtil/baseDAO');
exports.loadAllProduct = () => {
    let sql = 'select * from products pr, image img where pr.id = img.productId and img.isAvatar = true';
    return dbDAO.load(sql);
}

exports.single = (id) =>{
    return new Promise((resolve, reject) => {
        let sql = `select * from products pr, manufacturers mf where id = ${id} and pr.manufacturerId = mf.manufacturerId`;
        dbDAO.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            } else {
                resolve(rows[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
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