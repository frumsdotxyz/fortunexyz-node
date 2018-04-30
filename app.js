const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const User = require('./models/User');
const Fortune = require('./models/Fortune');
const Rating = require('./models/Rating');

app.use(cors());
app.use(bodyParser.json());

app.get('/fortunes', (request, response) => {
	Fortune.fetchAll().then(function(fortunes) {
		response.json(fortunes);
	});
});

app.get('/fortunes/:id', (request, response) => {
	let id = request.params.id;
	let fortune = new Fortune({id: id});
	fortune.fetch().then(function(fortune) {
		if(!fortune) {
			throw new Error(`Fortune #${id} does not exist`);
		} else {
			response.json(fortune);
		}
	}).catch(function(error) {
		response.status(404).json({error: error.message});
	});
});

app.post('/fortunes', (request, response) => {
	let { fortune, user_id } = request.body;
	let ids = [];
	User.fetchAll().then(function(users) {
		ids = users.map(x => x.id);
		try {
			if (fortune.length < 5) {
				throw new Error('Fortune must be at least 5 characters long');
			}
			if (!ids.includes(user_id)) {
				throw new Error('User with this ID does not exist');
			}
			let newFortune = new Fortune({fortune: fortune, user_id: user_id}); // can't let extra params through
			newFortune.save();
			response.status(201).send();
		} catch (e) {
			response.status(422).json({error: e.message});
		}
	});
});

app.patch('/fortunes/:id', (request, response) => {
	let id = request.params.id;
	let oldFortune = new Fortune({id: id});
	oldFortune.fetch().then(function(oldFortune) {
		if(!oldFortune) {
			throw new Error(`Fortune #${id} does not exist`);
		} else {
			let { fortune, user_id } = request.body;
			let ids = [];
			User.fetchAll().then(function(users) {
				ids = users.map(x => x.id);
				try {
					if (fortune && fortune.length < 5) {
						throw new Error('Fortune must be at least 5 characters long');
					}
					if (user_id && !ids.includes(user_id)) {
						throw new Error('User with this ID does not exist');
					}
					// good to go
					if (fortune) {
						oldFortune.set('fortune', fortune);
					}
					if (user_id) {
						oldFortune.set('user_id', user_id);
					}
					oldFortune.save();
					response.status(204).send();
				} catch (e) {
					response.status(422).json({error: e.message});
				}
			});
		}
	}).catch(function(error) {
		response.status(404).json({error: error.message});
	});
});

app.delete('/fortunes/:id', function(request, response) {
	let fortune = new Fortune({id: request.params.id});
	fortune.destroy().then(function(fortune) {
		if(fortune) {
			response.status(204).send();
		}
	}).catch(function(error) {
		response.status(404).json({error: `Fortune #${request.params.id} does not exist`})
	});
})

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`port ${port} is audible`))