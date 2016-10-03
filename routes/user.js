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
	User.findAll({})
	.then(function(userList) {
		res.render('userindex', {users: userList});
	})
})

router.get('/:id', function(req, res, next) {
	Page.findAll({
		where: {
			authorId: req.params.id
		}
	})
	.then(function(pageList) {
		User.findOne({
			where: {
				id: req.params.id
			}
		})
		.then(function(foundUser) {
			res.render('userpage', {user: foundUser, pages: pageList});
		})
	})
})

