let bookshelf = require('./../bookshelf');

module.exports = bookshelf.Model.extend({
	hasTimestamps: true,
	tableName: 'fortunes',
	idAttribute: 'id'
});