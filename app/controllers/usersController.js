const  models = require('../models');

const bcrypt = require('bcrypt');

const usersController = {
    signin: (req, res) => {
        res.render('signin');
    },

    processSigup: (req, res) => {

        req.checkBody('firstName', 'firstname is require').notEmpty();

        req.checkBody('lastName', 'lastname is require').notEmpty();

        req.checkBody('livingAddress', 'Address is require').notEmpty();

        req.checkBody('livingCity', 'City/Province is require').notEmpty();

        req.checkBody('dob', 'dob is require').notEmpty();

        req.checkBody('gender', 'Gender is require').notEmpty();

        req.checkBody('livingDistrict', 'District is require').notEmpty();
    
        req.checkBody('emaiAddress', 'Email is invalid').isEmail();

        req.checkBody('phoneNumber', 'Email is invalid').notEmpty();

        req.checkBody('password', 'password is require').notEmpty();

        req.checkBody('password', 'password is not matches').equals(req.body.confirmPassword);

        const errors = rep.validatorErrors();

        if (erros) {
             // res.status(422).json({
             //    error: true,
             //    msg: 'validate failure'
             // });
             res.render('signup', {erros: erros});
             res.end();
             console.log('validate failure');
        }

        else {

                models.users.isExistedUsername(req.body.userName).then(value => {
                    if (value != null) {
                         res.render('signup', {erros: 'username already taken'});
                        res.end();
                    }
                    else {

                        let salt = bcrypt.genSaltSync(10);
                        let encryptedPassword = bcrypt.hashSync(req.body.password,salt);
                        let user = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.userName,
                        gender: req.body.gender,
                        emailAddress: req.body.emailAddress,
                        phoneNumber: req.body.phoneNumber,
                        dob: req.body.dob,
                        livingAddress: req.body.livingAddress,
                        livingCity: req.body.livingCity,
                        livingDistrict: req.body.livingDistrict,
                        encryptedPassword: encryptedPassword };

                        models.users.add(user).then(value => {
                        console.log(value);
                        // res.status(200).json({
                        //     error: false,
                        //     msg: 'Your account has been created successfully!' });
                         res.render('signup', {erros: {}, msg: 'Your account has been created successfully!'});
                        console.log('successfully');
                        }).catch(err => {
                        // res.status(422).json({
                        //     error: true,
                        //     msg: 'Something went wrong!'
                        // });
                         res.render('signup', {erros: erros});
                        console.log('database operate wrongly');
                    });
                   }
                });
    }

        //res.status(200).json('FUCKING DAMN');
    },

    signup: (req, res) => {
        res.render('signup');
    }
}

module.exports = usersController;