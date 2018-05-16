const  models = require('../models/userModel');

const router = require('express').Router();

const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');


router.get('/signup', (req, res) => {
      res.render('signup');
});

// router.post('/signup',[
//         check('firstName', 'firstname is require').isEmpty(),

//         check('lastName', 'lastname is require').isEmpty(),

//         check('livingAddress', 'livingAddress is require').isEmpty(),

//         check('livingCity', 'livingCity is require').isEmpty(),

//         check('dob', 'dob is require').isEmpty(),

//         check('gender', 'gender is require').isEmpty(),

//         check('livingDistrict', 'livingDistrict is require').isEmpty(),
    
//         check('emaiAddress', 'Email is invalid').isEmail(),

//         check('phoneNumber', 'phone number is require').isEmpty(),

//         check('password', 'password is require').isEmpty()
//     ], (req, res) => {
//          // Finds the validation errors in this request and wraps them in an object with handy functions
//           const errors = validationResult(req);
//           if (!errors.isEmpty()) {
//             res.render('signup', {errors: errors.array()});
//             console.log("VALIDATE FAILED")
//           }
//           else {

//                 models.users.isExistedUsername(req.body.username).then(value => {
//                     if (value) {
//                         console.log("USERNAME ALREADY TAKEN")
//                          res.render('signup', {error: 'username already taken'});
//                     }
//                     else {

//                         let salt = bcrypt.genSaltSync(10);
//                         let encryptedPassword = bcrypt.hashSync(req.body.password,salt);
//                         let user = {
//                         firstName: req.body.firstName,
//                         lastName: req.body.lastName,
//                         username: req.body.username,
//                         gender: req.body.gender,
//                         emailAddress: req.body.emailAddress,
//                         phoneNumber: req.body.phoneNumber,
//                         dob: req.body.dob,
//                         livingAddress: req.body.livingAddress,
//                         livingCity: req.body.livingCity,
//                         livingDistrict: req.body.livingDistrict,
//                         encryptedPassword: encryptedPassword };

//                         user.livingCity = "HCMC";
//                         user.District = "Q1";
//                         console.log("******");
//                         console.log(user);
//                         console.log("******");

//                         models.users.add(user).then(value => {
//                        console.log("ADD OPERATION successfully");
//                          res.render('signup', {errors: {}, msg: 'Your account has been created successfully!'});
//                         console.log('successfully');
//                         }).catch(err => {
//                         console.log("ADD OPERATION FAILED FOR UNKNOWN REASONS");
//                          res.render('signup', {s: err});
//                     });
//                    }
//                 });
//     }
// });


router.post('/signup', (req, res) => {
         // Finds the validation errors in this request and wraps them in an object with handy functions
          

                        let salt = bcrypt.genSaltSync(10);
                        let encryptedPassword = bcrypt.hashSync(req.body.password,salt);
                        let user = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.username,
                        gender: req.body.gender,
                        emailAddress: req.body.emailAddress,
                        phoneNumber: req.body.phoneNumber,
                        dob: req.body.dob,
                        livingAddress: req.body.livingAddress,
                        livingCity: req.body.livingCity,
                        livingDistrict: req.body.livingDistrict,
                        encryptedPassword: encryptedPassword };

                        user.livingCity = "HCMC";
                        user.livingDistrict = "Q1";
                        console.log("******");
                        console.log(user);
                        console.log("******");

                        models.add(user).then(value => {
                       console.log("ADD OPERATION successfully");
                         res.render('signup', {errors: {}, msg: 'Your account has been created successfully!'});
                        console.log('successfully');
                        }).catch(err => {
                        console.log(err);
                        console.log("ADD OPERATION FAILED FOR UNKNOWN REASONS");
                         res.render('signup', {s: err});
                    });
});


module.exports = router;