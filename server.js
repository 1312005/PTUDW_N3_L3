const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const express_handlebars_sections = require('express-handlebars-sections');
const port = process.env.PORT || 3000;
const app = express();

const userController = require('./app/controllers/usersController');
const homeController = require('./app/controllers/homeController');
const aboutController = require('./app/controllers/aboutController');
const contactController = require('./app/controllers/contactController');
const productController = require('./app/controllers/productsController');
const cartController = require('./app/controllers/cartsController');

require('dotenv').config();

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(expressValidator());

app.use(bodyParser.json());

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir:  __dirname + '/app/views/layouts/',
    helpers: {
        section: express_handlebars_sections()
    }
}));
app.set('view engine', 'hbs');

app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', __dirname + '/app/views');

//require('./app/routes/routes.js')(app,controllers);
app.use(userController);
app.use(homeController);
app.use(aboutController);
app.use(contactController);
app.use(productController);
app.use(cartController);

// // catch 404 and forward to error handler
//     // note this is after all good routes and is not an error handler
//     // to get a 404, it has to fall through to this route - no error involved

//     app.use(function (req, res, next) {
//         var err = new Error('Not Found');
//         err.status = 404;
//         next(err);
//     });

//     // error handlers - these take err object.
//     // these are per request error handlers.  They have two so in dev
//     // you get a full stack trace.  In prod, first is never setup

//     // development error handler
//     // will print stacktrace

//     if (app.get('env') === 'development') {
//         app.use(function (err, req, res, next) {
//             res.status(err.status || 500);
//             res.render('error', {
//                 message: err.message,
//                 error: err,
//                 layout: false
//             });
//         });
//     }

//     // production error handler
//     // no stacktraces leaked to user
//     app.use(function (err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: {}
//         });
//     });

app.listen(port, () => console.log("Running at Port " + port));