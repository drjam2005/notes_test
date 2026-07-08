const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.set('trust proxy', true)
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('ip', (req) => req.ip);
app.use(morgan(':method :status :response-time :body :ip :remote-addr'));

let notes = [
	{
		id: "1",
		content: "Hello!",
		important: true
	},
	{
		id: "2",
		content: "World!",
		important: false,
	},
	{
		id: "3",
		content: ":3",
		important: false
	},
];


app.get('/', (req, res) => {
	res.send(`Hello, World!`)
})

app.get('/api/notes', (req, res) => {
	res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
	const id = req.params.id;
	const note = notes.find(n => n.id === id);
	if(!note)
		return res.status(404).json({ error: `note of id ${id} not found!` });

	res.json(note).end();
})

app.post('/api/notes', (req, res) => {
	const body = req.body;
	if(!body)
		return res.status(400).json({ error: `request must have a body!` });

	if(!body.content)
		return res.status(400).json({ error: `request body must have content!` });

	const note = {
		id: String(notes.length+1),
		content: body.content,
		important: body.important || false
	};

	notes = notes.concat(note);
	res.json(note);
})

app.put('/api/notes/:id', (req, res) => {
	const id = req.params.id;
	const body = req.body;

	if(!body)
		return res.status(400).json({ error: `request must have a body!` });

	const foundNote = notes.find( note => note.id === id );
	if(!foundNote)
		return res.status(404).json({ error: `note of id ${id} not found!`});

	const note = {
		id: id,
		content: body.content ?? foundNote.content,
		important: body.important ?? foundNote.important
	};

	notes = notes.map(n => n.id === id ? note : n);
	res.json(note);
})

app.delete('/api/notes/:id', (req, res) => {
	const id = req.params.id;
	notes = notes.filter(note => note.id !== id);
	
	res.status(204).end();
})

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Example app listening to port ${PORT}`);
})
