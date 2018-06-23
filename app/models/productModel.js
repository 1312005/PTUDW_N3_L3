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
exports.loadTop10Product = (type)=>{
    let sql = `SELECT id,productName,ImagesPath,price FROM products ORDER BY ${type} DESC limit 10`;
    return dbDAO.load(sql);
}

exports.loadTop3Product = (type)=>{
    let sql = `SELECT id,productName,ImagesPath,price FROM products ORDER BY ${type} DESC limit 3`;
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

/*Single-Page */
exports.load5ProductFromTheSameManufacturer = (idPro,idManufacturer)=>{
    let sql = `select * from products where manufacturerId = ${idManufacturer} and id <> ${idPro} limit 5`;
    return dbDAO.load(sql);
}

exports.load5ProductInTheSameCategory = (idPro,idCategory)=>{
    let sql = `select * from products where categoryId = ${idCategory} and id <> ${idPro} limit 5`;
    return dbDAO.load(sql);
}
/*Search */
exports.searchProductByName = (nameProduct,offset)=>{
    let sql = `select * from products where products.productName like '%${nameProduct}%' limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return dbDAO.load(sql);
}

exports.countProductSearch = (nameProduct)=>{
    let sql = `select count(*) as total from products where products.productName like '%${nameProduct}%'`;
    return dbDAO.load(sql);
}

/*Other */
exports.getCategoryByName = (categoryName)=>{
    return new Promise((resolve, reject) => {
        let sql = `select * from categories where categoryName = '${categoryName}'`;
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

exports.getManufacturerByName = (manufacturerName) =>{
    return new Promise((resolve, reject) => {
        let sql = `select * from manufacturers mf where manufacturerName = '${manufacturerName}'`;
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

exports.searchProductByPrice = (nameProduct,minPrice,maxPrice,offset)=>{
    let sql = `select * from products where productName like '%${nameProduct}%' and price between ${minPrice} and ${maxPrice} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return dbDAO.load(sql);
}

exports.countProductSearchByPrice = (nameProduct,minPrice,maxPrice)=>{
    let sql = `select count(*) as total from products where productName like '%${nameProduct}%' and price between ${minPrice} and ${maxPrice}`;
    return dbDAO.load(sql);
}
exports.searchProductByCriteria = (nameProduct,idCategory,idManufacturer,minPrice,maxPrice,offset)=>{
    let sql = `select * from products where productName like '%${nameProduct}%' and categoryId = ${idCategory} and manufacturerId = ${idManufacturer} and price between ${minPrice} and ${maxPrice} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return dbDAO.load(sql);
}

exports.countProductSearchByCriteria = (nameProduct,idCategory,idManufacturer,minPrice,maxPrice)=>{
    let sql = `select count(*) as total from products where productName like '%${nameProduct}%' and categoryId = ${idCategory} and manufacturerId = ${idManufacturer} and price between ${minPrice} and ${maxPrice}`;
    return dbDAO.load(sql);
}

exports.searchProductByCategory = (nameProduct,idCategory,minPrice,maxPrice,offset)=>{
    let sql = `select * from products where productName like '%${nameProduct}%' and categoryId = ${idCategory} and price between ${minPrice} and ${maxPrice} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return dbDAO.load(sql);
}

exports.countProductSearchByCategory = (nameProduct,idCategory,minPrice,maxPrice)=>{
    let sql = `select count(*) as total from products where productName like '%${nameProduct}%' and categoryId = ${idCategory} and price between ${minPrice} and ${maxPrice}`;
    return dbDAO.load(sql);
}

exports.searchProductByManufacturer = (nameProduct,idManufacturer,minPrice,maxPrice,offset)=>{
    let sql = `select * from products where productName like '%${nameProduct}%' and manufacturerId = ${idManufacturer} and price between ${minPrice} and ${maxPrice} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return dbDAO.load(sql);
}

exports.countProductSearchByManufacturer = (nameProduct,idManufacturer,minPrice,maxPrice)=>{
    let sql = `select count(*) as total from products where productName like '%${nameProduct}%' and manufacturerId = ${idManufacturer} and price between ${minPrice} and ${maxPrice}`;
    return dbDAO.load(sql);
}

exports.fetchSingle= (id) => {
    let sql = `select * from products where id = ${id}`;
    return dbDAO.load(sql);
}