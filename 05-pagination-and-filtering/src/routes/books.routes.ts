import { Router, type Request, type Response } from "express";
import { getId, logRequest } from "../utils.js";
import { books } from '../data.js';
import { type Book } from '../types.js';

export const booksRouter = Router();

booksRouter.get('/', (req: Request, res: Response) => {
	logRequest(req);
	res.status(200).json(books);
});

booksRouter.get('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const book: Book | undefined = books.find((book) => book.id === id);

	if (!book) {
		res.status(404).send('Book not found');
		return;
	}

	res.status(200).json(book);
});

booksRouter.post('/', (req: Request, res: Response) => {
	logRequest(req);
	const { title, author, year, genre, available } = req.body;

	const newBook: Book = {
		id: getId(),
		title,
		author,
		year: Number(year),
		genre,
		available: Boolean(available)
	};

	books.push(newBook);
	res.status(200).json(newBook);
});

booksRouter.put('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const book: Book | undefined = books.find((book) => book.id === id);

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
});

booksRouter.delete('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const book: Book | undefined = books.find((book) => book.id === id);

	if (!book) {
		res.status(404).send('Book not found');
		return;
	}

	books.splice(books.indexOf(book), 1);
	res.status(200).json(book);
});