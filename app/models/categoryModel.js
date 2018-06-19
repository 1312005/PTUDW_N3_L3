'use strict'

const dbDAO = require('../dbUtil/baseDAO.js');

exports.loadAllCategory = () =>{
    let sql = 'select * from categories';
    return dbDAO.load(sql);
}