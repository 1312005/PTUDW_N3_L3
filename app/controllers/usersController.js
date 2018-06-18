const  models = require('../models/userModel');
const provinceModel = require('../models/provinceModel');
const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const request = require('request');
const passport = require('passport');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');


// router.post('/signin', [
//   check('username', 'Username is required').exists(),
//   check('password', 'Password is required').exists(),
//   ],(req, res) => {
//   const errors = validationResult(req);
//           if (!errors.isEmpty()) {
//             res.render('signin', {errors: errors });
//             console.log("VALIDATE FAILED");
//             console.log(errors);
//           }
//           else {
//                models.isExistedUsername(req.body.username)
//                .then(user => {
//                 let match = bcrypt.compareSync(req.body.password, user.encryptedPassword);
//                 console.log(match);
//                 if(match) {
//                    res.redirect('/');
//                 }
//               else {
//                 res.redirect('/signup');
//               }
              
//                })
//                .catch(err => {
//                 console.log(err);
//                  res.redirect('/signup');
//                });
//           }
// });


// REGISTERS
router.get('/signup', (req, res) => {
  provinceModel.fetchAll().then(provinces => {
    res.render('signup', {provinces: provinces})
    console.log(provinces);
  }).catch(error => {
    res.render('signup');
    console.log(error);
  })
});

router.post('/signup',[
        check('firstName', 'firstname is require').isLength({ min: 1 }),

        check('lastName', 'lastname is require').isLength({ min: 1 }),

        check('username', 'username is require')
        .isLength({ min: 5 })
        .custom(value => {
            return models.isExistedUsername(value).then(user => {
                if (user)
                throw new Error('this username is already in use');
            })
        }),
        check('livingAddress', 'livingAddress is require').isLength({ min: 1 }),

        check('dob', 'dob is require').isLength({ min: 1 }),

        check('gender', 'gender is require').isLength({ min: 1 }),

        check('livingDistrict', 'livingDistrict is require').isLength({ min: 1 }),
    
        check('emailAddress', 'Email is invalid')
        .isEmail()
        .trim()
        .custom(value => {
            return models.isExistedUsername(value).then(user => {
                if (user)
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
            res.render('signup', {errors: errors.mapped()});
            console.log("VALIDATE FAILED");
            console.log(errors);
          }
          else {
                 // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  else {

                
                 // Put your secret key here.
      let  secretKey = "6Lcc1FkUAAAAACn2XyEAq_qISTy1jtCF2Ee3puaM";
  // req.connection.remoteAddress will provide IP address of connected user.
  let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      //return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
            const errors = ['Failed captcha verification'];
            console.log(errors);
             res.render('signup', {errors: errors});
    }
    //res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
    else {
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
            livingTownId: parseInt(req.body.livingDistrict),
            encryptedPassword: encryptedPassword };


            models.add(user).then(value => {
           console.log("ADD OPERATION successfully");
            req.flash('success_msg','You are now registered and can log in');
            res.redirect('/login');
            // res.render('signup', {errors: {}, msg: 'Your account has been created successfully!'});
            console.log('successfully');
            }).catch(err => {
            const errors = ['ADD OPERATION FAILED FOR UNKNOWN REASONS'];
            console.log(err);
             res.render('signup', {errors: err});
        });

    }
  });
  }


    }
});


// LOGIN
router.get('/login', (req, res) => {
  res.render('login', {
    title: "Login Page"
  });
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/shop',
    failureRedirect:'/login',
    failureFlash: true,
    //session: false
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/shop');
});

router.get('/profile',ensureAuthenticated, (req, res) => {
  res.render('/profile');
});

router.post('/profile', (req, res) => {
  //
});


module.exports = router;