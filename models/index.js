var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikipractice', {logging: false});

var Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	},
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
}, {
	getterMethods: {
		route: function() {
			return '/wiki/' + this.urlTitle;
		}
	}
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		isEmail: true,
		allowNull: false
	}
});

Page.hook('beforeValidate', function (page) {
    page.urlTitle = generateUrlTitle(page.title);
    return page;
  });

Page.belongsTo(User, { as: 'author' });

function generateUrlTitle (title) {
  if (title) {
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    return Math.random().toString(36).substring(2, 7);
  }
}


module.exports = {
	Page,
	User
}