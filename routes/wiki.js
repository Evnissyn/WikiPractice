var express = require('express');
var router = express.Router();

var bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json());

var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports = router;

router.get('/', function(req, res, next) {
	// res.send('got to GET /wiki/');
	Page.findAll()
	.then(function(pageList) {
		res.render('index', {pages:pageList});
	});
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.post('/', function(req, res, next) {
	User.findOrCreate({
		where: {
			name: req.body.name,
			email: req.body.email
		}
	})
	.then(function (values) {

		var user = values[0];

		var page = Page.build({
			title: req.body.title,
			content: req.body.content
		});

		return page.save().then(function (page) {
			return page.setAuthor(user);
		});

	})
	.then(function (page) {
		res.redirect(page.route);
	})
	.catch(next);
	
	// page.save()
	// .then(function(newPage){
	// 	res.redirect(newPage.route);
	// })
})

router.get('/:urlTitle', function(req, res, next) {
	var urlTitle = req.params.urlTitle;

	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	})
	.then(function(foundPage) {
		User.findOne({
			where: {
				id: foundPage.authorId
			}
		})
		.then(function(foundUser) {
			res.render('wikipage', {page: foundPage, user: foundUser});
		});
	})
	.catch(next);
})