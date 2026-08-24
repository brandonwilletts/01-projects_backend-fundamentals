export type Book = {
	id: number;
	title: string;
	author: string;
	year: number;
	genre: string;
	available: boolean;
};

export type User = {
	id: number;
	name: string;
	email: string;
};

export type Loan = {
	id: number;
	userId: number;
	bookId: number;
	borrowedAt: string;
	dueAt: string;
	returnedAt: string | null;
};