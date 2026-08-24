import { type Book, type User, type Loan } from './types.js';

export const books: Book[] = [
  {
    id: 1,
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    genre: 'Science Fiction',
    available: true,
  },
  {
    id: 2,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    genre: 'Fantasy',
    available: false,
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    genre: 'Dystopian',
    available: true,
  },
  {
    id: 4,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    year: 1951,
    genre: 'Literary Fiction',
    available: true,
  },
  {
    id: 5,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    genre: 'Classic',
    available: false,
  },
  {
    id: 6,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Classic',
    available: true,
  },
  {
    id: 7,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    year: 1954,
    genre: 'Fantasy',
    available: true,
  },
  {
    id: 8,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    year: 1932,
    genre: 'Dystopian',
    available: false,
  },
  {
    id: 9,
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    year: 1953,
    genre: 'Science Fiction',
    available: true,
  },
  {
    id: 10,
    title: 'The Martian',
    author: 'Andy Weir',
    year: 2011,
    genre: 'Science Fiction',
    available: true,
  },
];

export const users: User[] = [
  {
    id: 11,
    name: 'Alice Johnson',
    email: 'alice@example.com'
  },
  {
    id: 12,
    name: 'Bob Smith',
    email: 'bob@example.com'
  },
  {
    id: 13,
    name: 'Charlie Brown',
    email: 'charlie@example.com'
  },
  {
    id: 14,
    name: 'Diana Miller',
    email: 'diana@example.com'
  },
  {
    id: 15,
    name: 'Ethan Wilson',
    email: 'ethan@example.com'
  },
  {
    id: 16,
    name: 'Fiona Taylor',
    email: 'fiona@example.com'
  }
];

export const loans: Loan[] = [
  {
    id: 17,
    userId: 11, // Alice Johnson
    bookId: 2, // The Hobbit
    borrowedAt: '2026-07-01T09:00:00Z',
    dueAt: '2026-07-15T09:00:00Z',
    returnedAt: null,
  },
  {
    id: 18,
    userId: 12, // Bob Smith
    bookId: 5, // To Kill a Mockingbird
    borrowedAt: '2026-06-20T14:30:00Z',
    dueAt: '2026-07-04T14:30:00Z',
    returnedAt: '2026-07-03T16:45:00Z',
  },
  {
    id: 19,
    userId: 13, // Charlie Brown
    bookId: 8, // Brave New World
    borrowedAt: '2026-07-10T11:15:00Z',
    dueAt: '2026-07-24T11:15:00Z',
    returnedAt: null,
  },
  {
    id: 20,
    userId: 14, // Diana Miller
    bookId: 1, // Dune
    borrowedAt: '2026-06-15T08:00:00Z',
    dueAt: '2026-06-29T08:00:00Z',
    returnedAt: '2026-06-28T10:20:00Z',
  },
  {
    id: 21,
    userId: 15, // Ethan Wilson
    bookId: 7, // The Lord of the Rings
    borrowedAt: '2026-07-12T17:45:00Z',
    dueAt: '2026-07-26T17:45:00Z',
    returnedAt: null,
  },
];