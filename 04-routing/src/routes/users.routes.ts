import { Router, type Request, type Response } from "express";
import { getId, logRequest } from "../utils.js";
import { users } from '../data.js';
import { type User } from '../types.js';

export const usersRouter = Router();

usersRouter.get('/', (req: Request, res: Response) => {
	logRequest(req);
	res.status(200).json(users);
})

usersRouter.get('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const user: User | undefined = users.find((user) => user.id === id);

	if (!user) {
		res.status(404).send('User not found');
		return;
	}

	res.status(200).json(user);
})

usersRouter.post('/', (req: Request, res: Response) => {
	logRequest(req);
	const { name, email } = req.body;

	const newUser: User = {
		id: getId(),
		name,
		email
	};

	users.push(newUser);
	res.status(200).json(newUser);
});

usersRouter.put('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const user: User | undefined = users.find((user) => user.id === id);

	if (!user) {
		res.status(404).send('User not found');
		return;
	}

	const { name, email } = req.body;
	if (name) user.name = name;
	if (email) user.email = email;

	res.status(200).json(user);
});

usersRouter.delete('/:id', (req: Request, res: Response) => {
	logRequest(req);
	const id: number = Number(req.params.id);
	const user: User | undefined = users.find((user) => user.id === id);

	if (!user) {
		res.status(404).send('User not found');
		return;
	}

	users.splice(users.indexOf(user), 1);
	res.status(200).json(user);
});