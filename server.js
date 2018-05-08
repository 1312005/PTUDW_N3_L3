var express = require('express');
var path = require('path');
var morgan = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');
var port = process.env.PORT || 3000;
var controllers = require('./app/controllers');
const pool = require('./config/database');
var app = express();

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));


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

require('./app/routes/routes.js')(app, pool, controllers);



app.listen(port, () => console.log("Running at Port " + port));