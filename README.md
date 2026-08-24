# Backend Fundamentals Project Roadmap

## Purpose

This repository develops production-oriented backend engineering skills through focused mini-projects that progressively extend a Node.js + TypeScript application.

The progression is:

**HTTP fundamentals → persistence → validation/testing → middleware/observability → caching/security → asynchronous processing → API reliability → containers → deployment/documentation**

Projects 1–4 are already complete.

## How to Use This Roadmap

For each unfinished project:

1. Read the project specification.
2. Build the project yourself before looking for a complete implementation.
3. Use official documentation freely for syntax and APIs.
4. Run every **Required Completion Criterion / Test**.
5. Do not move on until the required tests pass.
6. Complete the **Understanding Check** without relying on your code.

### General Testing Rules

Unless a project says otherwise:

- Prefer automated tests over manual inspection.
- Test the happy path, invalid input, and at least one relevant failure path.
- Keep tests deterministic and independent of execution order.
- Use isolated test data/state.
- Do not require manually starting the server before the test suite.
- When external services are involved, use mocks/fakes for deterministic tests and add a separate real-service smoke test where useful.
- Record any required environment variables and setup commands in the project README.
- When measuring performance, define the workload and run repeated measurements rather than reporting one cherry-picked result.
- A project is not complete merely because it worked once.

## Completion Tracker

- [x] Project 1 --- Project Setup
- [x] Project 2 --- HTTP Server
- [x] Project 3 --- Express Server
- [x] Project 4 --- Routing
- [ ] Project 5 --- Pagination, Filtering, Search, and Sorting
- [ ] Project 6 --- PostgreSQL Persistence
- [ ] Project 7 --- Database Migrations
- [ ] Project 8 --- Request Validation
- [ ] Project 9 --- Automated API Testing
- [ ] Project 10 --- Middleware and Central Error Handling
- [ ] Project 11 --- Logging and Observability
- [ ] Project 12 --- Redis Caching
- [ ] Project 13 --- Authentication
- [ ] Project 14 --- Authorization
- [ ] Project 15 --- Object Storage
- [ ] Project 16 --- Background Jobs
- [ ] Project 17 --- Queue Reliability Patterns
- [ ] Project 18 --- Webhooks
- [ ] Project 19 --- API Versioning
- [ ] Project 20 --- Idempotent HTTP Writes
- [ ] Project 21 --- Docker
- [ ] Project 22 --- Docker Compose
- [ ] Project 23 --- Cloud Deployment
- [ ] Project 24 --- OpenAPI / Swagger Documentation

------------------------------------------------------------------------

## ✅ Project 1 --- Project Setup

### Objective

Initialize a production-ready Node.js + TypeScript backend project from scratch.

### Required Implementation

- Create a Node.js project with TypeScript.
- Add separate source and test directories.
- Configure scripts for development, build, start, and test.
- Keep configuration and secrets outside committed source code.

### Required Completion Criteria / Tests

1. A clean install followed by `npm run build` succeeds.
2. The compiled application starts with the documented command.
3. TypeScript compilation reports no errors.
4. A fresh checkout can be set up using only the README instructions.

### Understanding Check

Explain:

- Why TypeScript is compiled before production execution.
- The difference between development dependencies and runtime dependencies.

------------------------------------------------------------------------

## ✅ Project 2 --- HTTP Server

### Objective

Build a basic REST-style HTTP server using Node's built-in `http` module and keep book data in memory.

### Required Implementation

- Create a server without Express.
- Support at least `GET /health`, `GET /books`, and `POST /books`.
- Parse the request method, URL, body, and response status manually.

### Required Completion Criteria / Tests

1. `GET /health` returns HTTP 200.
2. `GET /books` returns the current in-memory books.
3. `POST /books` adds a book and returns an appropriate success status.
4. Malformed JSON returns a controlled 4xx response rather than crashing the server.
5. An unknown route returns 404.

### Understanding Check

Explain:

- What Node's `http` module gives you directly.
- What work a web framework later abstracts away.

------------------------------------------------------------------------

## ✅ Project 3 --- Express Server

### Objective

Rebuild the HTTP server using Express and compare the framework abstractions with the raw Node implementation.

### Required Implementation

- Reimplement the Project 2 endpoints with Express.
- Use Express body parsing and route handlers.
- Preserve the same externally visible behavior as Project 2.

### Required Completion Criteria / Tests

1. The Project 2 endpoint tests still pass against the Express version.
2. Malformed JSON is handled without crashing.
3. Unknown routes return 404.
4. The server can be started and stopped cleanly from tests.

### Understanding Check

Explain:

- Which responsibilities Express removed from your code.
- Why framework convenience does not remove the underlying HTTP concepts.

------------------------------------------------------------------------

## ✅ Project 4 --- Routing

### Objective

Separate related endpoints into dedicated route modules.

### Required Implementation

- Create a dedicated router for books.
- Mount the router from the application entry point.
- Keep route definitions out of the main server/bootstrap file.

### Required Completion Criteria / Tests

1. All existing endpoint behavior remains unchanged after the refactor.
2. Book routes can be imported without starting the server.
3. The main application file no longer contains individual book endpoint implementations.

### Understanding Check

Explain:

- Why route modules improve maintainability.
- The difference between routing and business logic.

------------------------------------------------------------------------

## Project 5 --- Pagination, Filtering, Search, and Sorting

### Objective

Extend collection endpoints so clients can request only the subset of data they need.

### Required Implementation

- Support pagination on `GET /books` using `page` + `limit` or a documented cursor approach.
- Support filtering on at least two fields, such as author and publication year.
- Support text search over title and/or author.
- Support deterministic sorting by at least two fields.
- Validate all query parameters and define sensible defaults.

### Required Completion Criteria / Tests

1. A request for page 2 does not repeat the records returned on page 1 when the dataset is unchanged.
2. Filtering by author returns only books matching that author.
3. Combining two filters returns only records satisfying both filters.
4. Searching for a known substring returns the expected matching book(s).
5. Sorting ascending and descending produces the exact inverse ordering for a fixed dataset with unique sort keys.
6. Invalid `page`, `limit`, filter, or sort values return 400.
7. The response includes enough metadata to understand pagination, such as total count/page information or next cursor.

### Understanding Check

Explain:

- Why pagination becomes necessary as a collection grows.
- Why deterministic sorting matters for paginated results.
- The difference between filtering, searching, and sorting.

------------------------------------------------------------------------

## Project 6 --- PostgreSQL Persistence

### Objective

Replace in-memory data with PostgreSQL using Prisma and introduce clear service/controller separation.

### Required Implementation

- Add PostgreSQL and Prisma.
- Create `User`, `Book`, and `Loan` models with appropriate relationships.
- Implement `GET /books`, `POST /books`, `GET /users`, `POST /users`, and `POST /loans` against PostgreSQL.
- Move business logic into services and HTTP translation into controllers.

### Required Completion Criteria / Tests

1. Create a book, restart the application, and verify the book still exists.
2. Create a user and a loan and verify the relationships are stored correctly.
3. A loan referencing a nonexistent user or book fails safely.
4. Two records with a deliberately unique field cannot violate the configured uniqueness rule.
5. An integration test runs against an isolated test database and leaves the database in a known state.

### Understanding Check

Explain:

- The difference between durable persistence and in-memory state.
- What Prisma provides versus what PostgreSQL itself is responsible for.
- Why controllers and services should have different responsibilities.

------------------------------------------------------------------------

## Project 7 --- Database Migrations

### Objective

Learn how to evolve a database schema reproducibly without manually editing the database.

### Required Implementation

- Start with a simpler `Book` schema containing `title` and `author`.
- Add `isbn`, `publishedYear`, and `availableCopies` through migrations.
- Create and apply migrations using Prisma.
- Document how a developer creates a database from scratch.

### Required Completion Criteria / Tests

1. A completely empty database can be brought to the current schema using migrations only.
2. Existing seed data survives the migration when it is valid under the new schema.
3. The Prisma schema and actual database schema agree after migration.
4. No manual database edits are required to make the application work.
5. A migration failure is surfaced clearly rather than leaving the application silently running against the wrong schema.

### Understanding Check

Explain:

- Why migrations belong in version control.
- Why changing a TypeScript model is not sufficient to change a database.
- Why production schema changes can be risky even when they work locally.

------------------------------------------------------------------------

## Project 8 --- Request Validation

### Objective

Validate untrusted input before it reaches business logic.

### Required Implementation

- Use Zod for `CreateBookInput`, `UpdateBookInput`, `CreateUserInput`, and `CreateLoanInput`.
- Validate request bodies, route parameters, and relevant query parameters.
- Return a consistent validation-error response.

### Required Completion Criteria / Tests

1. A valid request reaches the controller/service and succeeds.
2. A missing required field returns 400.
3. A field with the wrong runtime type returns 400.
4. An invalid route parameter such as a malformed ID returns 400.
5. Business logic is not called for rejected input.
6. The validation error response contains useful field-level information without exposing internals.

### Understanding Check

Explain:

- Why TypeScript types do not validate network input at runtime.
- Why validation should occur before business logic.
- The difference between syntactic validation and business-rule validation.

------------------------------------------------------------------------

## Project 9 --- Automated API Testing

### Objective

Build a repeatable test suite that proves the API works without manually starting the server.

### Required Implementation

- Use Vitest and Supertest.
- Cover health, books, users, loans, invalid input, and at least one database-backed flow.
- Create isolated test setup/teardown.
- Make tests independent of execution order.

### Required Completion Criteria / Tests

1. `npm test` starts everything it needs and completes without manually launching the API.
2. All existing endpoint happy-path tests pass.
3. At least one invalid-body test verifies a 400 response.
4. At least one 404 test verifies unknown routes.
5. At least one database integration test creates data, reads it back, and cleans it up.
6. Running the entire suite twice in a row produces the same result.
7. Running a single test file independently still passes.

### Understanding Check

Explain:

- The difference between unit, integration, and end-to-end tests.
- Why test isolation matters.
- Why a test that only checks status code is often insufficient.

------------------------------------------------------------------------

## Project 10 --- Middleware and Central Error Handling

### Objective

Move shared request-pipeline behavior out of individual route handlers.

### Required Implementation

- Use `express.json()`.
- Add CORS.
- Move request validation into reusable middleware.
- Add centralized error handling.
- Add a not-found handler.

### Required Completion Criteria / Tests

1. Existing routes still return the same successful responses.
2. An unknown route returns the centralized 404 response.
3. A deliberately thrown application error maps to the intended HTTP status.
4. An unexpected error returns 500 without exposing a stack trace in production mode.
5. Validation failures are handled consistently across at least two routes.
6. Route handlers no longer contain duplicated error-response boilerplate.

### Understanding Check

Explain:

- Why Express middleware order matters.
- Which responsibilities belong in middleware versus controllers or services.
- Why central error handling improves consistency.

------------------------------------------------------------------------

## Project 11 --- Logging and Observability

### Objective

Add structured logs that make it possible to understand what happened during a request.

### Required Implementation

- Use Pino.
- Assign or propagate a request ID.
- Log request method, path, response status, duration, and request ID.
- Log errors with structured context.
- Avoid logging passwords, tokens, or other secrets.

### Required Completion Criteria / Tests

1. One failed request can be followed through the relevant logs using a single request ID.
2. Every completed request contains method, path, status code, and duration.
3. A deliberately slow request reports a larger duration than a trivial health request.
4. Passwords and authentication tokens do not appear in captured logs.
5. Production logs are machine-parseable structured output rather than free-form concatenated strings.

### Understanding Check

Explain:

- Why structured logging is more useful than scattered `console.log` calls.
- Why request IDs become more important as systems become asynchronous or distributed.
- The difference between logs, metrics, and traces.

------------------------------------------------------------------------

## Project 12 --- Redis Caching

### Objective

Use Redis to reduce repeated database reads while preserving correctness.

### Required Implementation

- Cache `GET /books` and `GET /books/:id`.
- Record whether a request was served from cache or database during development/testing.
- Invalidate or update relevant cache entries after create, update, and delete operations.
- Define what happens if Redis is unavailable.

### Required Completion Criteria / Tests

1. The first request for a book misses cache and reaches the database.
2. The second identical request hits cache and does not query the database.
3. Updating a book prevents the old cached value from being returned.
4. Deleting a book prevents the deleted object from being returned from cache.
5. A Redis outage follows the documented behavior and does not silently return incorrect data.
6. Cache keys distinguish requests whose filters/pagination produce different responses.

### Understanding Check

Explain:

- Why Redis is not the source of truth in this architecture.
- Why cache invalidation is difficult.
- Why query parameters must be reflected in collection-cache keys.

------------------------------------------------------------------------

## Project 13 --- Authentication

### Objective

Identify users through registration, login, logout, and authenticated-session lookup.

### Required Implementation

- Implement `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, and `GET /auth/me`.
- Hash passwords with bcrypt.
- Use sessions or JWT and document the choice.
- Store secrets and signing keys outside source control.

### Required Completion Criteria / Tests

1. Registration stores a password hash rather than the plaintext password.
2. Correct credentials authenticate successfully.
3. Incorrect credentials fail without revealing whether the password or username was wrong.
4. `GET /auth/me` succeeds only with valid authentication.
5. Logout invalidates the chosen authentication mechanism as designed.
6. Expired/invalid authentication is rejected.
7. A password or token never appears in application logs.

### Understanding Check

Explain:

- The difference between authentication and authorization.
- How the selected session/JWT mechanism works from login through subsequent requests.
- Why password hashing is different from encryption.

------------------------------------------------------------------------

## Project 14 --- Authorization

### Objective

Restrict operations based on identity, role, and ownership.

### Required Implementation

- Add `ADMIN` and `MEMBER` roles.
- Allow anyone to view books.
- Allow only admins to create/update/delete books.
- Allow only authenticated users to create loans.
- Allow users to view only their own loans.

### Required Completion Criteria / Tests

1. An unauthenticated protected request returns 401.
2. An authenticated member attempting an admin-only action returns 403.
3. An admin can perform the admin-only action.
4. A user cannot retrieve another user's loans by changing a URL/body ID.
5. Authorization rules are enforced server-side even if the client omits UI restrictions.

### Understanding Check

Explain:

- Why authentication does not imply permission.
- The difference between role-based authorization and object-level ownership checks.
- Why authorization must be tested with deliberately malicious inputs.

------------------------------------------------------------------------

## Project 15 --- Object Storage

### Objective

Store uploaded book-cover files in object storage and relational metadata in PostgreSQL.

### Required Implementation

- Use Multer for uploads.
- Use S3 or an S3-compatible service.
- Implement `POST /books/:id/cover` and a retrieval mechanism.
- Store filename, MIME type, size, storage key, and book ID in PostgreSQL.
- Validate allowed MIME types and maximum size.

### Required Completion Criteria / Tests

1. Uploading a valid cover succeeds and creates corresponding metadata.
2. Retrieving the stored object returns the same bytes that were uploaded.
3. An oversized upload is rejected.
4. A disallowed file type is rejected.
5. A nonexistent book cannot receive an orphaned cover record.
6. Replacing or deleting a cover follows a documented cleanup policy so stale objects do not accumulate silently.

### Understanding Check

Explain:

- Why large binary objects are often stored outside the relational database.
- Why user filenames should not directly become trusted storage keys.
- Why object-storage cleanup must be considered separately from database cleanup.

------------------------------------------------------------------------

## Project 16 --- Background Jobs

### Objective

Move slow work out of the synchronous HTTP request path using a queue and worker.

### Required Implementation

- Use BullMQ.
- When a cover is uploaded, enqueue processing work.
- Return `202 Accepted` while work continues asynchronously.
- Run processing in a separate worker process.
- Update persistent state when processing finishes.

### Required Completion Criteria / Tests

1. The upload request returns before the worker finishes the job.
2. The queued job eventually changes the expected database state.
3. Stopping the worker does not prevent the API from accepting a new job.
4. Restarting the worker processes jobs that remained queued.
5. A failed job is visible as failed rather than disappearing silently.

### Understanding Check

Explain:

- Why background jobs improve request latency.
- The difference between accepting work and completing work.
- Why queue durability matters.

------------------------------------------------------------------------

## Project 17 --- Queue Reliability Patterns

### Objective

Make asynchronous job processing safe under transient failures, permanent failures, delay, and duplicate execution.

### Required Implementation

- Add retry attempts with backoff.
- Add delayed jobs.
- Define failed/dead-letter behavior.
- Make workers idempotent.
- Implement a delayed loan-reminder job.

### Required Completion Criteria / Tests

1. A job configured to fail twice and then succeed is attempted exactly three times.
2. A permanently failing job reaches the configured failed/dead-letter state.
3. A delayed job does not execute before its scheduled delay.
4. Submitting the same logical job twice does not duplicate its external side effect.
5. Restarting a worker during processing does not cause incorrect duplicate state.

### Understanding Check

Explain:

- Why many queues provide at-least-once rather than exactly-once processing.
- Why idempotent workers are a practical response to duplicate delivery.
- Which failures should and should not be retried.

------------------------------------------------------------------------

## Project 18 --- Webhooks

### Objective

Receive and process events from an external system safely.

### Required Implementation

- Create `POST /webhooks/payment`.
- Accept an external event ID and event type.
- Persist received event identity/status.
- Process supported events exactly once from the application's perspective.
- Define behavior for unknown event types.

### Required Completion Criteria / Tests

1. The first valid `payment.succeeded` event is processed successfully.
2. Replaying the exact same event ID does not duplicate its side effect.
3. Malformed payloads return a controlled 4xx response.
4. An unknown event type follows the documented behavior.
5. Two concurrent deliveries of the same event still produce one logical processing result.

### Understanding Check

Explain:

- Why webhook senders commonly retry.
- Why event IDs are important.
- Why a 200 response and successful downstream processing are separate concerns.

------------------------------------------------------------------------

## Project 19 --- API Versioning

### Objective

Support an API change without immediately breaking existing clients.

### Required Implementation

- Expose `/api/v1/books` and `/api/v2/books`.
- Keep v1 returning its original response contract.
- Have v2 add `availabilityStatus`.
- Share underlying service logic where possible.

### Required Completion Criteria / Tests

1. Both v1 and v2 work at the same time.
2. A regression test proves v1's response shape remains unchanged.
3. A v2 request includes `availabilityStatus`.
4. A v2-only change does not break v1 tests.
5. Version routing does not require duplicating all business logic.

### Understanding Check

Explain:

- What kinds of changes justify a new API version.
- Why response-contract tests are valuable.
- Why versioning should not mean copying the entire application.

------------------------------------------------------------------------

## Project 20 --- Idempotent HTTP Writes

### Objective

Make retried write requests safe by using idempotency keys.

### Required Implementation

- Support `Idempotency-Key` for `POST /loans` and the payment-webhook flow.
- Persist enough information to recognize a replay.
- Return the original result or a documented equivalent for an identical replay.
- Define behavior when the same key is reused with a different request payload.

### Required Completion Criteria / Tests

1. Two identical sequential requests with the same key create one loan.
2. Two concurrent identical requests with the same key create one loan.
3. Replaying a successful request produces the documented repeated response.
4. Reusing the same key with a materially different payload is rejected.
5. A different idempotency key permits a genuinely new operation.

### Understanding Check

Explain:

- Why network timeouts make idempotent writes important.
- How idempotency differs from a simple uniqueness constraint.
- Why concurrency must be tested rather than only sequential retries.

------------------------------------------------------------------------

## Project 21 --- Docker

### Objective

Package the API into a reproducible container image.

### Required Implementation

- Create a Dockerfile.
- Use a `.dockerignore`.
- Pass environment-specific configuration at runtime.
- Run as a non-root user where practical.
- Use a production start command rather than a development watcher.

### Required Completion Criteria / Tests

1. `docker build .` succeeds from a clean checkout.
2. The resulting image starts with one documented `docker run` command.
3. The health endpoint is reachable from outside the container.
4. Stopping and restarting the container works without rebuilding the image.
5. No development secret is embedded in the image.

### Understanding Check

Explain:

- The difference between an image and a container.
- The difference between build-time and runtime configuration.
- Why containers should not be treated as durable storage.

------------------------------------------------------------------------

## Project 22 --- Docker Compose

### Objective

Run the complete local backend stack as multiple cooperating containers.

### Required Implementation

- Compose the API, PostgreSQL, Redis, and worker.
- Use service names for inter-container networking.
- Persist PostgreSQL data with a volume.
- Add health checks or startup coordination where appropriate.

### Required Completion Criteria / Tests

1. `docker compose up` starts the complete stack from a clean local state.
2. The API connects to PostgreSQL and Redis using Compose networking rather than host `localhost` assumptions.
3. A real queued job is processed by the worker container.
4. Database data remains after stopping and restarting the application containers.
5. A broken dependency produces a visible unhealthy/not-ready state rather than silent partial startup.

### Understanding Check

Explain:

- Why containers use service names instead of `localhost` to reach one another.
- Which state belongs in volumes.
- Why startup order and readiness are different concepts.

------------------------------------------------------------------------

## Project 23 --- Cloud Deployment

### Objective

Deploy the complete backend system outside your laptop.

### Required Implementation

- Deploy the API, worker, PostgreSQL, Redis, object storage integration, and environment variables.
- Expose a public URL.
- Expose health/readiness behavior.
- Make logs accessible through the platform.

### Required Completion Criteria / Tests

1. A request from an external client reaches the public API successfully.
2. Data persists across an application restart/redeploy.
3. A queued job is processed by the deployed worker.
4. Redis-backed behavior works in the deployed environment.
5. Object upload/retrieval works in the deployed environment.
6. A deliberately triggered application error appears in production logs with a request ID.
7. Secrets exist in platform configuration and are not committed to the repository.
8. The health endpoint reports success when the application is ready.

### Understanding Check

Explain:

- What differs between local and production environments.
- Why deployment includes operations concerns, not just making a URL public.
- Why environment configuration should be externalized.

------------------------------------------------------------------------

## Project 24 --- OpenAPI / Swagger Documentation

### Objective

Document the API as an explicit machine-readable contract.

### Required Implementation

- Add OpenAPI documentation for auth, users, books, loans, and webhooks.
- Document request bodies, parameters, successful responses, and relevant errors.
- Serve Swagger UI.
- Keep documentation close enough to implementation that drift is detectable.

### Required Completion Criteria / Tests

1. Swagger UI loads successfully.
2. At least one endpoint can be called successfully from Swagger UI.
3. The OpenAPI document passes a schema validator.
4. Required fields in the OpenAPI schema match runtime validation for at least three endpoints.
5. Documented 400, 401, 403, and 404 responses match actual tested behavior where applicable.

### Understanding Check

Explain:

- Why an API specification is different from prose documentation.
- How documentation drift occurs.
- How OpenAPI can support clients, tests, or tooling.

------------------------------------------------------------------------

# Recommended Repository Structure

```text
backend-fundamentals/
├── 01-<project-name>/
├── 02-<project-name>/
├── ...
└── README.md
```

For each unfinished project, use approximately:

```text
README.md
src/
tests/
```

Add `results/` for benchmarks or evaluation outputs.

Each project README should record:

- objective;
- setup and run commands;
- implementation notes;
- required test results;
- relevant metrics;
- design decisions/tradeoffs;
- what you learned;
- remaining questions.