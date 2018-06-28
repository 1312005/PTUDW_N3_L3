'use strict'

const dbDAO = require('../dbUtil/baseDAO.js');

exports.loadAllCategory = () =>{
    let sql = 'select * from categories';
    return dbDAO.load(sql);
}

exports.addCategory = (categoryName,description)=>{
    let sql = `insert into categories(categoryName,description) VALUES ('${categoryName}','${description}')`;
    return dbDAO.save(sql);
}

exports.updateCategory= (categoryId,categoryName,description)=>{
    let sql = `UPDATE categories SET categoryName = '${categoryName}', description = '${description}' WHERE categoryId = ${categoryId}`;
    // console.log(sql);
    return dbDAO.save(sql);
}

exports.deleteCategory = (categoryId)=>{
    let sql = `delete from categories where categoryId = ${categoryId}`;
    return dbDAO.save(sql);
}