'use strict'
const router = require('express').Router();
const ensureAuthenticated = require('../../middlewares/ensureAuthenticated');
const ensureHasRole = require('../../middlewares/ensureHasRole');
const {
  check,
  validationResult
} = require('express-validator/check');
const validator = require('validator');

router.get('/products_management', ensureHasRole, (req, res) => {
    res.render('admin/products_management', {
      layout: 'admin'
    });
  });
  
module.exports = router;