const  models = require('../models/userModel');

const router = require('express').Router();

const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');


router.get('/signup', (req, res) => {
      res.render('signup');
});

router.post('/signup',[
        check('firstName', 'firstname is require').isLength({ min: 1 }),

        check('lastName', 'lastname is require').isLength({ min: 1 }),

        check('username', 'username is require')
        .isLength({ min: 5 })
        .custom(value => {
            return models.isExistedUsername(value).then(user => {
                throw new Error('this username is already in use');
            })
        }),
        check('livingAddress', 'livingAddress is require').isLength({ min: 1 }),

        check('livingCity', 'livingCity is require').isLength({ min: 1 }),

        check('dob', 'dob is require').isLength({ min: 1 }),

        check('gender', 'gender is require').isLength({ min: 1 }),

        check('livingDistrict', 'livingDistrict is require').isLength({ min: 1 }),
    
        check('emailAddress', 'Email is invalid')
        .isEmail()
        .trim()
        .custom(value => {
            return models.isExistedUsername(value).then(user => {
                throw new Error('this email is already in use');
            })
        }),

        check('phoneNumber', 'phone number is require and only contain digits')
        .isLength({ min: 10 })
        .matches('\\d+'),

        check('password', 'password is require')
        .isLength({ min: 5 })
        .matches(/\d/),

        check('confirmPassword', 'password confirm is require').exists(),

        check('confirmPassword', 'passwords must be at least 5 chars long and contain one number')
        .exists()
        .custom((value, { req }) => value === req.body.password)
    ], (req, res) => {
         // Finds the validation errors in this request and wraps them in an object with handy functions
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.render('signup', {errors: errors.mapped() });
            console.log("VALIDATE FAILED");
            console.log(errors.mapped());
          }
          else {
                 // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  else {

                // let salt = bcrypt.genSaltSync(10);
                //         let encryptedPassword = bcrypt.hashSync(req.body.password,salt);
                //         let user = {
                //         firstName: req.body.firstName,
                //         lastName: req.body.lastName,
                //         username: req.body.username,
                //         gender: req.body.gender,
                //         emailAddress: req.body.emailAddress,
                //         phoneNumber: req.body.phoneNumber,
                //         dob: req.body.dob,
                //         livingAddress: req.body.livingAddress,
                //         livingCity: req.body.livingCity,
                //         livingDistrict: req.body.livingDistrict,
                //         encryptedPassword: encryptedPassword };

                //         user.livingCity = "HCMC";
                //         user.livingDistrict = "Q1";
                //         console.log("******");
                //         console.log(user);
                //         console.log("******");

                //         models.add(user).then(value => {
                //        console.log("ADD OPERATION successfully");
                //          res.render('signup', {errors: {}, msg: 'Your account has been created successfully!'});
                //         console.log('successfully');
                //         }).catch(err => {
                //         const errors = ['ADD OPERATION FAILED FOR UNKNOWN REASONS'];
                //         console.log(errors);
                //          res.render('signup', {errors: err});
                //     });

                 // Put your secret key here.
  var secretKey = "6Lcc1FkUAAAAACn2XyEAq_qISTy1jtCF2Ee3puaM";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
  });
  }


    }
});


module.exports = router;