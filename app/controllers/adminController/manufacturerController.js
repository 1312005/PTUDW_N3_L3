'use strict'
const router = require('express').Router();
const manufacturerModel = require('../../models/manufacturerModel');
const config = require('../../../config/config');
const ensureAuthenticated = require('../../middlewares/ensureAuthenticated');
const ensureHasRole = require('../../middlewares/ensureHasRole');
const {
  check,
  validationResult
} = require('express-validator/check');
const validator = require('validator');

router.get('/manufacturers_management',(req,res)=>{
    
    manufacturerModel.loadAllManufacturer().then(rows=>{
        let vm = {
            layout: 'admin',
            lManufacturer: rows,
        }
        res.render('admin/makers_management',vm);
    })
    
});

router.post('/add_manufacturer',(req,res)=>{
    let name = req.body.name.trim();
    let address = req.body.address.trim();
    let email = req.body.email.trim();
    let phone = req.body.phone.trim();
    let description = req.body.description.trim();
    manufacturerModel.addManufacturer(name,address,email,phone,description).then(value=>{
        res.redirect('/manufacturers_management');
    });
});

router.post('/edit_manufacturer',(req,res)=>{
    let id = req.body.id;
    let name = req.body.name.trim();
    let address = req.body.address.trim();
    let email = req.body.email.trim();
    let phone = req.body.phone.trim();
    let description = req.body.description.trim();
    manufacturerModel.updateManufacturer(id,name,address,email,phone,description).then(value=>{
        res.redirect('/manufacturers_management');
    })
})
module.exports = router;