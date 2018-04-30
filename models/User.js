let bookshelf = require('./../bookshelf');

module.exports = bookshelf.Model.extend({
	hasTimestamps: true,
	tableName: 'users',
	idAttribute: 'id'
});