const  models = require('../models');

var usersController = {
    index:  (req, res) => {
        models.user.getAll(req.user_id, function(err, result) {
            if (err) res.send('Eror load data');
            else {
                // other query nếu có
                res.render('users', { data1: result });
                
            }
        });
    },

    signin: (req, res) => {
        res.render('signin');
    },

    signup: (req, res) => {
        res.render('signup');
    }
}

module.exports = usersController;