import express from 'express';
import { type Express, type Request, type Response } from 'express';
import { config } from './config.js';
import { books, addBook } from "./data.js";

const port: number = config.server.port;
const hostname: string = config.server.hostname;
const env: string = config.env ? config.env : 'undefined';

function logRequest(req: Request) {
	console.log();
	console.log("-------------------");
	console.log("Request");
	console.log("- Method: " + req.method);
	console.log("- URL:    " + req.url);
	console.log("- Body:    " + JSON.stringify(req.body, null, 2));
	console.log("-------------------");
	console.log();
}

const app: Express = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
	logRequest(req);
	res.status(200).send('status ok');
})

app.get('/books', (req: Request, res: Response) => {
	logRequest(req);
	res.status(200).json(books);
})

app.get('/books/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id = Number(req.params.id);
	const book = books.find(book => book.id === id);

	if (!book) {
		res.status(404).send('Book not found');
		return;
	}

	res.status(200).json(book);
})

app.post('/books', (req: Request, res: Response) => {
	logRequest(req);
	const { title, author, year, genre, available } = req.body;
	const newBook = addBook(title, author, Number(year), genre, Boolean(available));
	res.status(200).json(newBook);
})

app.put('/books/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id = Number(req.params.id);
	const book = books.find(book => book.id === id);

	if (!book) {
		res.status(404).send('Book not found');
		return;
	}

	const { title, author, year, genre, available } = req.body;

	if (title) book.title = title;
	if (author) book.author = author;
	if (year) book.year = Number(year);
	if (genre) book.genre = genre;
	if (available) book.available = Boolean(available);

	res.status(200).json(book);
})

app.delete('/books/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id = Number(req.params.id);
	const book = books.find(book => book.id === id);

	if (!book) {
		res.status(404).send('Book not found');
		return;
	}

	books.splice(books.indexOf(book), 1);
	res.status(200).json(book);
})

app.listen(port, hostname, () => {
	console.log(`Environment: ${env}`);
	console.log(`Server running at http://${hostname}:${port}/`);
})