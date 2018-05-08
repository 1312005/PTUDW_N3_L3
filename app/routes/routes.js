module.exports = (app, pool, controllers) => {

    app.get('/', controllers.home.index);

    /* Product Routes */
    app.get('/shop', controllers.products.index);
    app.get('/single-product',controllers.products.singleProduct);
    /* About Routes */
    app.get('/aboutus', controllers.about.index);

    /* Contact Routes */
    app.get('/contactus', controllers.contact.index);

    // app.post('/signup', controllers.users.signup);

    //app.get('/users/:id', controller.user.profile);*/


    /* USERS ROUTES */
    app.get('/signin', controllers.users.signin);
    app.get('/signup', controllers.users.signup);

    /* Cart Routes */
    app.get('/cart', controllers.carts.index);


    // catch 404 and forward to error handler
    // note this is after all good routes and is not an error handler
    // to get a 404, it has to fall through to this route - no error involved

    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers - these take err object.
    // these are per request error handlers.  They have two so in dev
    // you get a full stack trace.  In prod, first is never setup

    // development error handler
    // will print stacktrace

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                layout: false
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

}