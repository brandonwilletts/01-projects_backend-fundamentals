# 04-routing

## Routing
Create a new routes/ directory and organize related endpoints (for example, /health, /books, /users, and /loans) into separate files. Each file should create and export its own `Router()` instance, defining the relevant sub-routes within it. The routers are then mounted in `app.ts` using `app.use()`.

For now, keep the route handlers inline within each route file. As the application grows, these handlers can later be extracted into dedicated controllers or services.

## Endpoints
- GET    /health

- GET    /books
- GET    /books/:id
- POST   /books
- PUT    /books/:id
- DELETE /books/:id

- GET    /users
- GET    /users/:id
- POST   /users
- PUT    /users/:id
- DELETE /users/:id

- GET    /loans
- GET    /loans/:id
- POST   /loans
- PUT    /loans/:id
- DELETE /loans/:id

## Resources
1. Basic routing
   https://expressjs.com/en/starter/basic-routing.html
2. Routing guide
   https://expressjs.com/en/guide/routing.html