var express = require('express');
var app = express();
var volleyball = require('volleyball');
var bodyparser = require('body-parser');
var nunjucks = require('nunjucks');

var models = require('./models/');
var wikiRouter = require('./routes/wiki');
var userRouter = require('./routes/user');

var env = nunjucks.configure('view', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/', volleyball);
app.use('/', express.static('./public')); // ????
app.use('/wiki', wikiRouter);
app.use('/user', userRouter);

app.get('/', function(req, res, next){
	res.redirect('/wiki');
})

// not found middleware
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	console.error(err);
	next(err);
});

// error-handling middleware
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	console.error(err);
	res.render('error', {err: err});
});

models.User.sync({})
.then(function () {
	return models.Page.sync({})
})
.then(function () {
	app.listen(3001, function () {
		console.log('Server is listening on port 3001!');
	});
})
.catch(console.error);
