# 02-http-server

## Server-Client Protocol

A server is usually a long-running process that listens for incoming connections on one or more ports. Clients initiate communication, and once a connection is established, messages are passed back-and-forth.

Server workflow (TCP):

1. Create a socket (a communication endpoint that behaves like a file descriptor)
2. Bind the socket to an IP address and port
3. Listen for incoming connections
4. Accept a client connection
5. Send and receive data
6. Close the connection

Client workflow (TCP):

1. Create a socket
2. Connect to the server's IP address and port
3. Send and receive data
4. Close the connection

In the context of an HTTP server, the browser typically acts as the client and send "requests" to the server, which in turn, sends back "responses". HTTP defines the format of requests and responses and is built "on top" of the TCP protocol.

HTTP request messages typically contain:

- Method (ie: GET, PUT, PATCH, DELETE), path (/api/exammple), and protocol version (HTTP/1.1)
- Optional header that contains additional information
- Optional body (typically JSON)

HTTP response messages typically contain:

- Protocol version (HTTP/1.1), status code (200), and status message (OK)
- Optional header that contains additional information
- Optional body (typically JSON)

## Node.js HTTP Server

The first step is to create the server object using `createServer()` and have it listen to our port / IP address using the `listen()` method (server.ts). Add script `"dev": "cross-env NODE_ENV=development tsx src/server.ts"` so you can start the server with `npm run dev`.

To set-up endpoints, we need to parse the incoming request and, depending on the method and URL, return the appropriate response using an "if statement". Note that the response body is a stream - we therefore use the .on() method to process 'error', 'data', and 'end'.

This is all defined within the `createServer()` method. Even with a small number of endpoints, it's pretty easy to see how cumbersome this could get. I expect Express to provide abstraction and modularity to this structure.

## Endpoints
- GET /health
- GET /books
- GET /books/:id
- POST /books
- PUT /books/:id
- DELETE /books/:id

## Resources
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
- https://nodejs.org/learn