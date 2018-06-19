const manufacturerModel = require('../models/manufacturerModel');
const categoryModel = require('../models/categoryModel');
module.exports = (req,res,next)=>{
    let p1 = manufacturerModel.loadAllManufacturer();
    let p2 = categoryModel.loadAllCategory();
    Promise.all([p1,p2]).then(([lManufacturers,lCategory])=>{
        res.locals.layoutVM = {
            manufacturer: lManufacturers,
            category: lCategory,
        };
        next();
    });
}