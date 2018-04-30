const knex = require('knex');

function connect() {
	return knex({
		client: 'sqlite3',
		connection: {
			filename: './database.sqlite'
		}
	});
}

module.exports = connect;