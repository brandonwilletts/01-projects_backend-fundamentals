import { createServer } from "node:http";
import { config } from "./config.js";
import { books, addBook } from "./data.js";

const port = config.server.port;
const hostname = config.server.hostname;

const server = createServer((req, res) => {
	const { method, url } = req;
	let body: Buffer[] = [];

	console.log();
	console.log("-------------------");
	console.log("Request");
	console.log("- Method: " + method);
	console.log("- URL:    " + url);
	console.log("-------------------");
	console.log();

	if (method === 'GET' && url === '/health') {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ status: "ok", }));
	}

	else if (method === 'GET' && url === '/books') {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(books, null, 2));
	}

	else if (method === 'GET' && url?.startsWith('/books/')) {
		const id = Number(url.split('/')[2]);
		const book = books.find(book => book.id === id);

		if (!book) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json')
			res.end('Book not found');
			return;
		}

		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(book, null, 2));
	}

	else if (method === 'POST' && url === '/books') {
		req
			.on('error', err => {
				console.error(err);
			})
			.on('data', chunk => {
				body.push(chunk);
			})
			.on('end', () => {
				try {
					const data = JSON.parse(Buffer.concat(body).toString());
					const { title, author, year, genre, available } = data;
					const newBook = addBook(title, author, Number(year), genre, Boolean(available));

					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(newBook, null, 2));

				} catch (error) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json')
					res.end('Invalid JSON format');
				}
			})
	}

	else if (method === 'PUT' && url?.startsWith('/books/')) {
		const id = Number(url.split('/')[2]);
		const book = books.find(book => book.id === id);

		if (!book) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json')
			res.end('Book not found');
			return;
		}

		req
			.on('error', err => {
				console.error(err);
			})
			.on('data', chunk => {
				body.push(chunk);
			})
			.on('end', () => {
				try {
					const data = JSON.parse(Buffer.concat(body).toString());
					const { title, author, year, genre, available } = data;

					book.title = title;
					book.author = author;
					book.year = Number(year);
					book.genre = genre;
					book.available = Boolean(available);

					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(book, null, 2));

				} catch (error) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json')
					res.end('Invalid JSON format');
				}
			})
	}

	else if (method === 'DELETE' && url?.startsWith('/books/')) {
		const id = Number(url.split('/')[2]);
		const book = books.find(book => book.id === id);

		if (!book) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json')
			res.end('Book not found');
			return;
		}

		books.splice(books.indexOf(book), 1);

		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(book, null, 2));
	}
});

server.listen(port, hostname, () => {
	console.log(`Environment: ${config.env}`);
	console.log(`Server running at http://${hostname}:${port}/`);
});