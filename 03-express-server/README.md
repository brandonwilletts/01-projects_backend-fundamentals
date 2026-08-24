# 03-express-server

## Express
Express is a web framework built on top of Node.js that simplifies common server tasks such as routing, request parsing, middleware, and response handling. It abstracts away much of the low-level HTTP logic so developers can focus on building applications rather than server plumbing.

## Set-up
Install Express and TypeScript types:
`npm install express @types/express`

Create a new file called `app.ts` and edit the `package.json` dev script to open `src/app.ts`.
Add the `watch` flag to automatically register changes while running: `cross-env NODE_ENV=development tsx watch src/app.ts`

## Express Server
Create a new Express object and assign it to a variable called app. We then use the routing methods below to handle requests and responses and .listen() to listen on a specific port.

Routes use the following format:
`app.METHOD(PATH, HANDLER)`

Use req methods:
- .status(200)
- .json({})
- .send()

When a request contains params, like `/books/:id`, we use `req.params` object (ie: `req.params.id`).

Note that you must use the middleware `app.use(express.json())` in order to parse JSON requests. Requests must include the header `Content-Type': 'application/json'`.

Overall, Express makes it much easier to handle routes, requests, and responses.

## Endpoints
- GET /health
- GET /books
- GET /books/:id
- POST /books
- PUT /books/:id
- DELETE /books/:id

## Resources
1. Installing Express
    https://expressjs.com/en/starter/installing.html
2. Hello World example
    https://expressjs.com/en/5x/starter/hello-world/
3. Basic routing
    https://expressjs.com/en/starter/basic-routing.html
4. Routing guide
    https://expressjs.com/en/guide/routing.html
5. Express API reference
    https://expressjs.com/en/5x/api.html