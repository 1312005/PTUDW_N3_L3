'use stric'
const dbDAO = require('../dbUtil/baseDAO');

exports.loadAllManufacturer = ()=>{
    let sql = 'select* from manufacturers';
    return dbDAO.load(sql);
}