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
const controllers = require('./app/controllers');
const app = express();

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

require('./app/routes/routes.js')(app,controllers);



app.listen(port, () => console.log("Running at Port " + port));