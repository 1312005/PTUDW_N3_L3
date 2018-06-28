'use strict'
const dbDAO = require('../dbUtil/baseDAO');

exports.loadAllManufacturer = ()=>{
    let sql = 'select* from manufacturers';
    return dbDAO.load(sql);
}

exports.addManufacturer = (manufacturerName,manufacturerAddress,manufacturerEmail,manufacturerPhones,manufacturerDescription)=>{
    let sql = `insert into manufacturers(manufacturerName,manufacturerAddress,manufacturerEmail,manufacturerPhones,manufacturerDescription) VALUES ('${manufacturerName}','${manufacturerAddress}','${manufacturerEmail}','${manufacturerPhones}','${manufacturerDescription}')`;
    return dbDAO.save(sql);
}

exports.updateManufacturer = (manufacturerId,manufacturerName,manufacturerAddress,manufacturerEmail,manufacturerPhones,manufacturerDescription)=>{
    let sql = `UPDATE manufacturers SET manufacturerName = '${manufacturerName}', manufacturerAddress = '${manufacturerAddress}', manufacturerEmail = '${manufacturerEmail}',manufacturerPhones = '${manufacturerPhones}',manufacturerDescription = '${manufacturerDescription}' WHERE manufacturerId = ${manufacturerId}`;
    return dbDAO.save(sql);
}

exports.deleteManufacturer = (manufacturerId)=>{
    let sql = `DELETE from manufacturers where manufacturerId = ${manufacturerId}`
    return dbDAO.save(sql);
}