var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');

var app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: 'views/_layouts/'
}));
app.set('view engine', 'handlebars');

app.use(express.static(
	path.resolve(__dirname, 'public')
));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(3000, () => {
    console.log('server running on port 3000');
});