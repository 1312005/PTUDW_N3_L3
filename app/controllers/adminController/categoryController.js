'use strict'
const router = require('express').Router();
const categoryModel = require('../../models/categoryModel');
const config = require('../../../config/config');
const ensureAuthenticated = require('../../middlewares/ensureAuthenticated');
const ensureHasRole = require('../../middlewares/ensureHasRole');
const {
  check,
  validationResult
} = require('express-validator/check');
const validator = require('validator');

router.get('/categories_management',(req,res)=>{
    
    categoryModel.loadAllCategory().then(rows=>{
        let vm = {
            layout: 'admin',
            lCategory: rows,
        }
        res.render('admin/categories_management',vm);
    })
    
});

router.post('/add_category',(req,res)=>{
    let name = req.body.name.trim();
    let description = req.body.description.trim();
    categoryModel.addCategory(name,description).then(value=>{
        res.redirect('/categories_management');
    });
});

router.post('/edit_category',(req,res)=>{
    let id = req.body.id;
    let name = req.body.name.trim();
    let description = req.body.description.trim();
    categoryModel.updateCategory(id,name,description).then(value=>{
        res.redirect('/categories_management');
    })
})
module.exports = router;