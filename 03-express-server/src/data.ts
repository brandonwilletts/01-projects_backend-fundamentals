type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  available: boolean;
};

export function addBook(title: string, author: string, year: number, genre: string, available: boolean) {
  const newBook = { id: books.length + 1, title, author, year, genre, available }
  books.push(newBook);
  return newBook;
}

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