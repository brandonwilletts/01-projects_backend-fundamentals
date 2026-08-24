import express, { type Express } from 'express';
import { config } from './config.js';
import { healthRouter } from './routes/health.routes.js';
import { booksRouter } from './routes/books.routes.js';
import { loansRouter } from './routes/loans.routes.js';
import { usersRouter } from './routes/users.routes.js';

const app: Express = express();

app.use(express.json());

app.use('/health', healthRouter);
app.use('/books', booksRouter);
app.use('/loans', loansRouter);
app.use('/users', usersRouter);

const port: number = config.server.port;
const hostname: string = config.server.hostname;
const env: string = config.env ? config.env : 'undefined';

app.listen(port, hostname, () => {
  console.log(`Environment: ${env}`);
  console.log(`Server running at http://${hostname}:${port}/`);
});