import { Router, type Request, type Response } from "express";
import { getId, logRequest } from "../utils.js";
import { loans } from '../data.js';
import { type Loan } from '../types.js';

export const loansRouter = Router();

loansRouter.get('/', (req: Request, res: Response) => {
	logRequest(req);
	res.status(200).json(loans);
})

loansRouter.get('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const loan: Loan | undefined = loans.find((loan) => loan.id === id);

	if (!loan) {
		res.status(404).send('Loan not found');
		return;
	}

	res.status(200).json(loan);
})

loansRouter.post('/', (req: Request, res: Response) => {
	logRequest(req);
	const { userId, bookId, borrowedAt, dueAt, returnedAt } = req.body;

	const newLoan: Loan = {
		id: getId(),
		userId,
		bookId,
		borrowedAt,
		dueAt,
		returnedAt
	};

	loans.push(newLoan);
	res.status(200).json(newLoan);
});

loansRouter.put('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const loan: Loan | undefined = loans.find((loan) => loan.id === id);

	if (!loan) {
		res.status(404).send('Loan not found');
		return;
	}

	const { userId, bookId, borrowedAt, dueAt, returnedAt } = req.body;
	if (userId) loan.userId = userId;
	if (bookId) loan.bookId = bookId;
	if (borrowedAt) loan.borrowedAt = borrowedAt;
	if (dueAt) loan.dueAt = dueAt;
	if (returnedAt) loan.returnedAt = returnedAt;

	res.status(200).json(loan);
});

loansRouter.delete('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const loan: Loan | undefined = loans.find((loan) => loan.id === id);

	if (!loan) {
		res.status(404).send('Loan not found');
		return;
	}

	loans.splice(loans.indexOf(loan), 1);
	res.status(200).json(loan);
});