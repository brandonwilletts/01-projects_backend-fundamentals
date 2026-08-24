# Software Engineering Project Roadmap

## Purpose

This roadmap develops backend, applied AI, distributed-systems, and agent-engineering skills through focused mini-projects.

The progression is:

**HTTP fundamentals → persistence → testing/correctness → security → asynchronous processing → deployment → applied AI → distributed systems → agents**

The projects are intentionally small and concept-driven. Many projects extend the same running application, but each project has one primary learning objective and its own completion tests.

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

------------------------------------------------------------------------

# 01 --- Backend Fundamentals

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

# 02 --- Applied AI Engineering

These projects focus on building reliable applications that use language models, embeddings, retrieval, tools, streaming, and evaluation.

------------------------------------------------------------------------

## Project 1 --- Hosted LLM API Integration

### Objective

Integrate a hosted language model as an external dependency using a clean provider abstraction.

### Required Implementation

- Create a small provider interface.
- Implement one hosted-LLM provider.
- Handle credentials, timeout, and provider errors.
- Return usage/token metadata when available.

### Required Completion Criteria / Tests

1. A mocked provider test verifies the exact request shape sent by your application.
2. A real smoke test returns a model response using environment-provided credentials.
3. A provider timeout produces a controlled application error.
4. Provider credentials never appear in source code or logs.
5. Business logic can use the provider interface without knowing which vendor implementation is active.

### Understanding Check

Explain:

- Why an external LLM should be treated like any other unreliable network dependency.
- Why provider-specific code should be isolated.

------------------------------------------------------------------------

## Project 2 --- Embeddings

### Objective

Generate vector representations for documents and use them as application data.

### Required Implementation

- Generate embeddings for a small fixed document corpus.
- Persist the embedding together with source metadata.
- Inspect dimensions and basic vector properties.

### Required Completion Criteria / Tests

1. Every input document produces an embedding of the expected fixed dimension.
2. Repeated deterministic embedding calls for identical input produce the expected same or numerically equivalent result for the chosen provider/model.
3. Every stored embedding can be traced back to its source document.
4. Malformed/empty input follows a documented policy.

### Understanding Check

Explain:

- What an embedding is operationally.
- Why the embedding dimension is fixed for a model.

------------------------------------------------------------------------

## Project 3 --- Cosine Similarity

### Objective

Implement cosine similarity yourself and use it to compare embedding vectors.

### Required Implementation

- Implement cosine similarity without calling a library cosine helper.
- Compare your implementation against a trusted reference.
- Rank a fixed set of document embeddings for several query embeddings.

### Required Completion Criteria / Tests

1. A vector compared with itself returns approximately `1.0`.
2. Orthogonal synthetic vectors return approximately `0.0`.
3. Opposite synthetic vectors return approximately `-1.0`.
4. Your implementation matches a trusted reference within `1e-6` across at least 100 random vector pairs.
5. For five hand-authored query/document cases, the expected relevant item ranks above an unrelated control.

### Understanding Check

Explain:

- Why cosine similarity measures angle rather than vector magnitude.
- Why high embedding similarity is not the same as factual equivalence.

------------------------------------------------------------------------

## Project 4 --- Chunking

### Objective

Split long documents into retrievable units while preserving enough metadata to reconstruct their source.

### Required Implementation

- Implement at least one fixed-size chunker and one structure-aware or sentence/paragraph-aware chunker.
- Support configurable overlap.
- Attach document ID and source offsets/section metadata to every chunk.

### Required Completion Criteria / Tests

1. Every chunk references a valid source document.
2. Chunk source offsets map back to the expected original text.
3. No text is silently dropped under the documented chunking policy.
4. Changing overlap produces the expected repeated boundary content.
5. A fixed retrieval experiment compares the two chunking strategies on at least 10 queries.

### Understanding Check

Explain:

- Why chunk size is a retrieval/context tradeoff.
- Why overlap can help and why too much overlap can hurt.

------------------------------------------------------------------------

## Project 5 --- Vector Search

### Objective

Store embeddings in a searchable index and retrieve semantically similar chunks.

### Required Implementation

- Use a vector-capable database/index.
- Implement top-k nearest-neighbor retrieval.
- Support metadata filtering.
- Create a brute-force cosine-search baseline for a small fixed corpus.

### Required Completion Criteria / Tests

1. Top-k results from the vector index match brute-force search on the fixed small corpus.
2. A metadata filter never returns a chunk outside the allowed metadata.
3. Adding a new document makes it retrievable without breaking existing records.
4. Deleting a document removes its chunks from retrieval.
5. At least 20 fixed queries can be run automatically and their result IDs recorded.

### Understanding Check

Explain:

- Exact versus approximate nearest-neighbor search.
- Why retrieval quality needs a test set rather than one convincing demo.

------------------------------------------------------------------------

## Project 6 --- Retrieval-Augmented Generation

### Objective

Answer questions using retrieved document context and return the supporting sources.

### Required Implementation

- Retrieve top-k chunks for a query.
- Construct a context-grounded prompt.
- Generate an answer with a hosted LLM.
- Return source/chunk identifiers.
- Define behavior when evidence is insufficient.

### Required Completion Criteria / Tests

1. Create at least 30 answerable and 10 unanswerable questions from a fixed corpus.
2. For answerable questions, the expected supporting chunk appears in top-k retrieval at least 90% of the time.
3. Returned source IDs correspond exactly to chunks actually supplied to the model.
4. For unanswerable questions, the system follows the documented no-evidence/abstention behavior.
5. Removing the relevant source document causes the associated retrieval test to fail as expected, proving the test is meaningful.

### Understanding Check

Explain:

- The difference between retrieval failure and generation failure.
- Why RAG can still hallucinate with correct context.

------------------------------------------------------------------------

## Project 7 --- Function / Tool Calling

### Objective

Allow the model to request deterministic application functions while keeping execution under application control.

### Required Implementation

- Register at least two tools.
- Define JSON schemas for tool arguments.
- Validate tool names and arguments before execution.
- Execute tools in application code and return the result to the model.

### Required Completion Criteria / Tests

1. A fixed evaluation set of at least 20 prompts selects the expected tool for at least 90% of cases designed to require one of the tools.
2. Invalid tool arguments are rejected before execution.
3. The model cannot execute an unregistered tool.
4. A tool exception becomes a controlled tool result/error rather than crashing the request.
5. A prompt that requires no tool does not force a tool call.

### Understanding Check

Explain:

- Why the model chooses a tool but should not directly execute arbitrary code.
- Why tool inputs need normal validation and authorization.

------------------------------------------------------------------------

## Project 8 --- Structured Output

### Objective

Convert model output into validated data that deterministic application code can safely consume.

### Required Implementation

- Define a Zod or JSON Schema output contract.
- Request structured output.
- Validate every response.
- Use a bounded retry/repair policy if the provider does not guarantee the schema.

### Required Completion Criteria / Tests

1. At least 50 fixed inputs produce schema-valid outputs or a controlled failure.
2. Malformed mocked model output never reaches downstream business logic.
3. Retry attempts are bounded.
4. A schema change breaks an intentionally stale test, proving the contract is enforced.
5. Valid JSON that violates semantic business rules is separately rejected where appropriate.

### Understanding Check

Explain:

- Why valid JSON is not necessarily valid application data.
- Why structured output is preferable to ad-hoc text parsing.

------------------------------------------------------------------------

## Project 9 --- Reusable AI Harness

### Objective

Create a reusable wrapper that standardizes model calls across the application.

### Required Implementation

- Centralize provider selection, retries/timeouts, model settings, logging, usage metadata, and error translation.
- Support both plain text and structured responses.
- Allow callers to supply a prompt/template without duplicating provider code.

### Required Completion Criteria / Tests

1. Two different application features can use the same harness.
2. Provider errors map to one consistent application error interface.
3. Changing a default model setting in one place affects all callers that inherit the default.
4. Per-call overrides do not mutate global configuration.
5. A mocked harness test verifies logging/usage metadata without calling a real provider.

### Understanding Check

Explain:

- Why shared AI infrastructure should be separate from feature-specific prompts.
- Which behavior belongs in the harness and which belongs in the feature.

------------------------------------------------------------------------

## Project 10 --- Streaming Responses

### Objective

Stream LLM output incrementally to a client and handle cancellation and mid-stream failure.

### Required Implementation

- Use SSE or a documented chunked-streaming approach.
- Forward generated chunks/tokens incrementally.
- Handle client disconnect/cancellation.
- Measure time to first token/chunk and total request duration.

### Required Completion Criteria / Tests

1. The client receives multiple chunks before completion.
2. The first chunk arrives before the full response is complete.
3. Disconnecting the client stops or cancels downstream work where supported.
4. A simulated provider error after streaming begins follows the documented stream-error behavior.
5. Time-to-first-token/chunk is measured for at least 20 requests.

### Understanding Check

Explain:

- Why streaming improves perceived latency without necessarily reducing compute.
- Why HTTP error handling changes after the response has begun.

------------------------------------------------------------------------

## Project 11 --- Prompt Caching

### Objective

Cache safe repeated LLM requests without serving incorrect responses across users or configurations.

### Required Implementation

- Define a cache key that includes normalized input, prompt version, model identifier, and material generation settings.
- Set a TTL.
- Define which requests are safe to cache.
- Keep user-scoped content isolated.

### Required Completion Criteria / Tests

1. Two identical safe requests produce a cache miss followed by a hit.
2. Changing the prompt version causes a cache miss.
3. Changing a material model setting causes a cache miss.
4. User A cannot receive User B's user-scoped cached response.
5. A cache outage follows a documented fallback policy.

### Understanding Check

Explain:

- Why cache-key design determines correctness.
- Why semantic caching and exact caching have different risks.

------------------------------------------------------------------------

## Project 12 --- AI Application Evaluation

### Objective

Create a repeatable evaluation harness for the application rather than judging a few demos manually.

### Required Implementation

- Create a versioned evaluation dataset.
- Measure retrieval hit rate where retrieval is used.
- Measure structured-output validity where applicable.
- Measure tool-selection accuracy where applicable.
- Define one answer-quality rubric and document its limitations.
- Save results in machine-readable form.

### Required Completion Criteria / Tests

1. The full evaluation runs from one command.
2. Deterministic metrics reproduce exactly for the same application version and evaluation set.
3. An intentionally degraded configuration produces worse measured results.
4. Results record prompt/config version and model identifier.
5. Failures are categorized so retrieval, schema, tool, and generation failures can be distinguished.

### Understanding Check

Explain:

- Why evaluation should isolate component failures.
- Why a single aggregate score can hide important regressions.

------------------------------------------------------------------------

## Project 13 --- Prompt Versioning

### Objective

Treat prompts and model configuration as versioned application dependencies.

### Required Implementation

- Store prompts outside route handlers.
- Assign prompt versions.
- Record prompt version, model identifier, and generation configuration with evaluation runs.
- Keep at least two prompt versions available for comparison.

### Required Completion Criteria / Tests

1. Two prompt versions can be run against the exact same evaluation set.
2. A regression can be traced to the prompt/config version that produced it.
3. Production code has one authoritative copy of each prompt version.
4. Changing a prompt does not silently overwrite historical evaluation metadata.

### Understanding Check

Explain:

- Why prompt changes can behave like code changes.
- Why reproducibility requires prompt and configuration metadata.

------------------------------------------------------------------------

## Project 14 --- Batch LLM Requests

### Objective

Process many independent LLM tasks efficiently while controlling concurrency, retries, and partial failure.

### Required Implementation

- Accept a batch of independent model requests.
- Limit concurrency.
- Retry only retryable failures.
- Return per-item success/failure rather than failing the whole batch automatically.

### Required Completion Criteria / Tests

1. A 100-item test batch completes with every item accounted for.
2. Configured maximum concurrency is never exceeded.
3. One permanently failing item does not erase successful results from other items.
4. Retryable mocked failures recover according to policy.
5. Duplicate job submission follows a documented idempotency policy.

### Understanding Check

Explain:

- Why batch processing is different from one huge prompt.
- Why partial-failure semantics must be explicit.

------------------------------------------------------------------------

## Project 15 --- Guardrails and Safety Evaluation

### Objective

Add application-level controls for clearly disallowed inputs/outputs and evaluate their behavior.

### Required Implementation

- Define a small explicit policy relevant to the demo application.
- Implement pre- and/or post-generation checks.
- Log safety decisions without storing unnecessary sensitive content.
- Create a fixed adversarial evaluation set.

### Required Completion Criteria / Tests

1. Every test case has an expected allow/block outcome.
2. The evaluation reports false positives and false negatives.
3. At least 50 fixed cases run automatically.
4. A blocked input cannot reach the protected downstream action.
5. Changing the guardrail threshold/configuration produces measurable evaluation changes.

### Understanding Check

Explain:

- Why application guardrails are not the same as model alignment.
- Why false positives and false negatives both matter.

------------------------------------------------------------------------

# 03 --- Distributed Systems

These projects move from a single deployed application toward coordination across multiple processes, services, or data stores.

------------------------------------------------------------------------

## Project 1 --- Load Balancer

### Objective

Route traffic across multiple stateless server instances.

### Required Implementation

- Run at least two API instances.
- Place a simple load balancer or reverse proxy in front.
- Expose an instance identifier for testing only.

### Required Completion Criteria / Tests

1. Across 100 requests, both instances receive traffic.
2. Stopping one instance still allows successful requests after failure/health detection.
3. No request correctness depends on process-local mutable state.
4. Restarting the stopped instance allows it to rejoin traffic.

### Understanding Check

Explain:

- Why horizontal scaling discourages process-local state.
- Round-robin versus health-aware routing.

------------------------------------------------------------------------

## Project 2 --- Distributed Cache

### Objective

Use a shared Redis cache from multiple application instances.

### Required Implementation

- Run multiple API instances against one Redis cache.
- Cache a shared database-backed resource.
- Invalidate the cache from either instance.

### Required Completion Criteria / Tests

1. A cache entry created through instance A is visible to instance B.
2. A write through instance B invalidates data later read through instance A.
3. Stopping one API instance does not lose cache state.
4. A Redis outage follows the same documented failure policy from all instances.

### Understanding Check

Explain:

- Why a shared cache differs from an in-process cache.
- How cache invalidation becomes a cross-process coordination problem.

------------------------------------------------------------------------

## Project 3 --- Retry Logic

### Objective

Retry transient dependency failures without retrying everything blindly.

### Required Implementation

- Wrap a mock dependency with bounded retries.
- Use exponential backoff with jitter.
- Classify retryable and non-retryable failures.

### Required Completion Criteria / Tests

1. A dependency that fails twice and then succeeds is called exactly three times.
2. A non-retryable failure is attempted once.
3. Maximum attempts are enforced.
4. Backoff increases between attempts within the documented jitter policy.

### Understanding Check

Explain:

- Why retries can amplify an outage.
- Why retrying writes requires idempotency.

------------------------------------------------------------------------

## Project 4 --- Rate Limiting

### Objective

Limit request rates per client using a defined algorithm.

### Required Implementation

- Implement fixed window, sliding window, or token bucket.
- Key limits by a documented client identity.
- Return 429 when the limit is exceeded.

### Required Completion Criteria / Tests

1. Requests below the limit succeed.
2. The first request above the limit returns 429.
3. The bucket/window resets or refills according to the chosen algorithm.
4. Two different clients do not incorrectly share one limit.
5. Concurrent requests cannot trivially bypass the limit.

### Understanding Check

Explain:

- Burst limits versus sustained-rate limits.
- Why distributed rate limiting requires shared state or coordination.

------------------------------------------------------------------------

## Project 5 --- Circuit Breaker

### Objective

Stop repeatedly calling an unhealthy dependency.

### Required Implementation

- Implement closed, open, and half-open states.
- Configure failure threshold and cooldown.
- Wrap a controllable mock dependency.

### Required Completion Criteria / Tests

1. Repeated failures open the circuit.
2. Calls fail fast while the circuit is open.
3. After cooldown, a successful probe closes it.
4. A failed half-open probe reopens the circuit.
5. The state transitions are observable in logs or metrics.

### Understanding Check

Explain:

- How circuit breakers differ from retries.
- Why half-open recovery probes must be limited.

------------------------------------------------------------------------

## Project 6 --- Pub/Sub

### Objective

Broadcast events to multiple independent subscribers.

### Required Implementation

- Use Redis Pub/Sub or another simple broker.
- Create one publisher and at least two subscribers.
- Publish a typed event.

### Required Completion Criteria / Tests

1. One published event reaches both active subscribers.
2. Stopping one subscriber does not prevent the other from receiving events.
3. A late subscriber exhibits the documented missed-history behavior.
4. Malformed event data is handled safely by consumers.

### Understanding Check

Explain:

- Pub/sub versus a work queue.
- Ephemeral versus durable messaging.

------------------------------------------------------------------------

## Project 7 --- Eventual Consistency

### Objective

Build two views of data that may temporarily diverge but eventually converge.

### Required Implementation

- Maintain a primary record and a delayed secondary projection.
- Propagate updates asynchronously.
- Attach version or timestamp metadata.

### Required Completion Criteria / Tests

1. Immediately after a write, the secondary can be stale by design.
2. After propagation, both views converge.
3. An older delayed update cannot overwrite a newer version.
4. The maximum observed convergence delay is measured for a fixed test run.

### Understanding Check

Explain:

- What guarantees eventual consistency provides and does not provide.
- Why clients may need read-your-writes or other stronger semantics.

------------------------------------------------------------------------

## Project 8 --- Replication

### Objective

Replicate data and observe the implications of replica lag and failure.

### Required Implementation

- Create a controlled primary/replica setup or simulation.
- Replicate writes.
- Route selected reads to the replica.

### Required Completion Criteria / Tests

1. A committed primary write eventually appears on the replica.
2. Replica lag can be observed or measured.
3. A replica outage does not corrupt primary data.
4. A read from the replica may be stale under the documented setup.

### Understanding Check

Explain:

- Replication versus backup.
- Why replicas improve availability/read capacity but introduce consistency questions.

------------------------------------------------------------------------

## Project 9 --- Sharding

### Objective

Partition records across multiple data stores.

### Required Implementation

- Shard users by a deterministic key.
- Route reads and writes to the correct shard.
- Expose shard placement for testing.

### Required Completion Criteria / Tests

1. Every test user maps to exactly one shard.
2. Reads route to the same shard as writes.
3. 10,000 deterministic keys produce a documented distribution across shards.
4. Changing shard count demonstrates how many keys naive modulo sharding moves.

### Understanding Check

Explain:

- Sharding versus replication.
- Why resharding is operationally difficult.

------------------------------------------------------------------------

## Project 10 --- Distributed Tracing

### Objective

Trace one logical request across multiple services or async boundaries.

### Required Implementation

- Use at least two service/process boundaries.
- Propagate trace/correlation context.
- Record spans for dependency calls.

### Required Completion Criteria / Tests

1. One end-to-end request appears as one trace with child spans.
2. A deliberately slow downstream call is identifiable from the trace.
3. Trace context survives the service boundary.
4. An error in a child operation is reflected in the parent trace.

### Understanding Check

Explain:

- Logs versus metrics versus traces.
- Why context propagation is essential.

------------------------------------------------------------------------

## Project 11 --- Distributed Locks

### Objective

Coordinate mutually exclusive work across processes using shared state.

### Required Implementation

- Implement a lock using an appropriate shared store.
- Use lock ownership tokens.
- Use expiration/leases.
- Protect one shared operation.

### Required Completion Criteria / Tests

1. Two competing workers cannot both enter the protected critical section.
2. A crashed lock holder does not block the resource forever.
3. One worker cannot release another worker's lock.
4. A test demonstrates what happens if the lease expires during long work.

### Understanding Check

Explain:

- Why a distributed lock is harder than a local mutex.
- Why lock expiration solves one problem and creates another.

------------------------------------------------------------------------

## Project 12 --- Leader Election

### Objective

Select one active coordinator from multiple candidates and recover when it fails.

### Required Implementation

- Run at least three candidates.
- Use leases or heartbeats.
- Expose current leader identity for testing.

### Required Completion Criteria / Tests

1. Exactly one leader acts during steady state.
2. Stopping the leader causes another candidate to take over.
3. A recovered old leader does not continue acting without a valid lease.
4. Leadership changes are logged.

### Understanding Check

Explain:

- What split brain means.
- Why clocks, leases, and failure detection complicate leader election.

------------------------------------------------------------------------

## Project 13 --- Service Discovery

### Objective

Resolve service instances dynamically rather than hard-coding addresses.

### Required Implementation

- Register multiple service instances in a registry or platform-native discovery mechanism.
- Have a client resolve an available instance dynamically.

### Required Completion Criteria / Tests

1. Adding an instance makes it discoverable.
2. Removing/failing an instance removes it from usable results after the documented interval.
3. Clients continue operating across instance changes.
4. No client configuration hard-codes the individual instance ports/addresses.

### Understanding Check

Explain:

- Why dynamic infrastructure makes fixed addresses brittle.
- Client-side versus server-side discovery.

------------------------------------------------------------------------

## Project 14 --- Health and Readiness Checks

### Objective

Distinguish a running process from a process that is ready to receive traffic.

### Required Implementation

- Implement separate liveness and readiness checks.
- Define which dependencies affect readiness.
- Keep liveness focused on process health.

### Required Completion Criteria / Tests

1. During startup, the process can be live but not ready.
2. Breaking a critical dependency changes readiness according to policy.
3. A noncritical dependency does not incorrectly force liveness failure.
4. Restoring the critical dependency restores readiness.

### Understanding Check

Explain:

- Why liveness and readiness should not be identical.
- How bad health checks can create restart loops.

------------------------------------------------------------------------

## Project 15 --- Graceful Shutdown

### Objective

Stop a service without abruptly dropping in-flight work.

### Required Implementation

- Handle termination signals.
- Stop accepting new requests.
- Allow in-flight requests/jobs to finish within a timeout.
- Close database/queue connections.

### Required Completion Criteria / Tests

1. A long-running request started before shutdown completes within the grace period.
2. New work is no longer accepted once shutdown begins.
3. Connections/resources close before normal process exit.
4. If the grace period is exceeded, the process exits according to the documented forced-shutdown policy.

### Understanding Check

Explain:

- Why orchestrators need graceful shutdown behavior.
- Why shutdown is part of correctness.

------------------------------------------------------------------------

## Project 16 --- Autoscaling Experiment

### Objective

Observe how capacity changes in response to measured load.

### Required Implementation

- Generate a controlled workload.
- Choose a scaling signal such as CPU, concurrency, or queue depth.
- Use a platform autoscaler or local simulation.
- Measure latency while scaling occurs.

### Required Completion Criteria / Tests

1. Increasing load crosses the configured scale-out threshold.
2. Capacity increases.
3. Reducing load eventually causes scale-in.
4. p50 and p95 latency are recorded before, during, and after scale-out.
5. Cold-start or stabilization behavior is documented.

### Understanding Check

Explain:

- Why autoscaling is reactive.
- Why CPU may be a poor scaling metric for some workloads.

------------------------------------------------------------------------

## Project 17 --- Consistent Hashing

### Objective

Reduce key movement when nodes are added or removed.

### Required Implementation

- Implement a hash ring.
- Add virtual nodes.
- Compare with modulo-based sharding.

### Required Completion Criteria / Tests

1. Every key maps deterministically to one node.
2. Adding one node moves substantially fewer of 10,000 fixed keys than modulo sharding.
3. Removing one node remaps its keys while most other keys stay on their original node.
4. Virtual nodes produce a more balanced key distribution than a single token per node in your fixed experiment.

### Understanding Check

Explain:

- Why consistent hashing helps distributed caches and shards.
- Why virtual nodes improve balance.

------------------------------------------------------------------------

# 04 --- AI Agents

These projects build on the applied-AI and backend foundations to explore bounded agent loops, memory, planning, workflows, and human control.

------------------------------------------------------------------------

## Project 1 --- Agent Tool Loop

### Objective

Build a bounded agent loop in which a model can select tools, observe results, and continue until it returns an answer.

### Required Implementation

- Reuse registered, validated tools.
- Set a maximum number of agent steps.
- Persist a structured execution trace.

### Required Completion Criteria / Tests

1. A fixed task requiring at least two sequential tool calls completes successfully.
2. The agent stops when it reaches the configured maximum step count.
3. Invalid/unregistered tool requests cannot execute.
4. The trace contains enough information to reconstruct each model/tool step.

### Understanding Check

Explain:

- Why an agent loop differs from one function-calling request.
- Why bounded execution is necessary.

------------------------------------------------------------------------

## Project 2 --- Conversation Memory

### Objective

Add explicit short-term conversation state.

### Required Implementation

- Persist conversation history by conversation ID.
- Define a context-window/truncation policy.
- Keep different users/conversations isolated.

### Required Completion Criteria / Tests

1. A follow-up query can correctly use a fact supplied earlier in the same conversation.
2. A separate conversation cannot access that fact.
3. Conversation context growth is bounded by the documented policy.
4. Deleting a conversation removes its stored short-term history.

### Understanding Check

Explain:

- Model context versus application memory.
- Why memory isolation is a security boundary.

------------------------------------------------------------------------

## Project 3 --- Reflection / Critique

### Objective

Add one bounded critique-and-revision step and test whether it actually improves results.

### Required Implementation

- Generate an initial answer.
- Run a separate critique against explicit criteria.
- Permit only a fixed number of revisions.
- Record initial and revised outputs.

### Required Completion Criteria / Tests

1. Create a fixed evaluation set containing deliberately seeded omissions/errors.
2. The critique detects a documented fraction of those seeded issues.
3. The loop always terminates.
4. Record cases where reflection makes the answer worse rather than assuming improvement.

### Understanding Check

Explain:

- Why self-critique is not an oracle.
- Why extra agent steps should be justified by evaluation.

------------------------------------------------------------------------

## Project 4 --- Planning

### Objective

Separate task decomposition from task execution.

### Required Implementation

- Ask for a structured plan.
- Validate allowed step types.
- Execute plan steps under application control.
- Allow bounded replanning on failure.

### Required Completion Criteria / Tests

1. A fixed multi-step task produces a schema-valid plan.
2. All executed steps come from the allowed step set.
3. Malformed plans are rejected or repaired within the bounded policy.
4. A failed step triggers the documented replan/failure behavior.

### Understanding Check

Explain:

- Why a generated plan is a proposal rather than a guarantee.
- When replanning helps and when it adds unnecessary complexity.

------------------------------------------------------------------------

## Project 5 --- Multi-Agent Coordination

### Objective

Coordinate multiple specialized model roles while keeping state and responsibilities explicit.

### Required Implementation

- Define at least two distinct agent roles.
- Define how work/messages move between them.
- Set a global execution budget.
- Record all inter-agent transfers.

### Required Completion Criteria / Tests

1. A fixed task demonstrates both agents contributing distinct work.
2. No agent can exceed the global step/tool budget.
3. The final trace shows which agent produced each intermediate artifact.
4. Compare the multi-agent result with a simpler single-agent baseline on at least 20 tasks.

### Understanding Check

Explain:

- Why multiple agents can increase coordination cost.
- When specialization is preferable to a single general agent.

------------------------------------------------------------------------

## Project 6 --- Workflow Graphs

### Objective

Represent agentic work as explicit states and transitions.

### Required Implementation

- Build a workflow graph with branching, retries, and terminal states.
- Persist workflow state.
- Make side-effecting states idempotent.

### Required Completion Criteria / Tests

1. Every state has defined allowed transitions.
2. A forced failure follows the expected retry/error branch.
3. Restarting mid-workflow resumes from persisted state.
4. Completed side effects are not duplicated after resume.

### Understanding Check

Explain:

- Why explicit workflows are easier to reason about than free-form loops.
- Why persistence and idempotency matter for resumable workflows.

------------------------------------------------------------------------

## Project 7 --- Human Approval

### Objective

Require explicit human approval before a sensitive simulated side effect.

### Required Implementation

- Add an approval state.
- Persist the proposed action.
- Accept approve/reject decisions.
- Execute the side effect only after approval.

### Required Completion Criteria / Tests

1. The side effect cannot occur before approval.
2. Rejecting prevents the side effect.
3. Approving exactly once produces one side effect.
4. Replaying the same approval cannot duplicate the action.

### Understanding Check

Explain:

- Why human approval is an authorization/control mechanism.
- Where approval must be enforced so a model cannot bypass it.

------------------------------------------------------------------------

## Project 8 --- Long-Term Memory

### Objective

Store selected durable memories with scope, provenance, retrieval, update, and deletion behavior.

### Required Implementation

- Create a memory store separate from raw conversation history.
- Record source/provenance and scope.
- Retrieve relevant memories.
- Support update and deletion.

### Required Completion Criteria / Tests

1. A saved memory is retrievable in a later session.
2. A deleted memory is no longer returned.
3. Updating a memory changes later retrieval.
4. User A's memories never appear for User B.
5. A fixed relevance test set measures whether expected memories are retrieved and irrelevant controls are excluded.

### Understanding Check

Explain:

- Why storing all conversation text is not equivalent to useful long-term memory.
- Why provenance and deletion semantics matter.

------------------------------------------------------------------------

# Recommended Repository Structure

```text
backend-projects/
├── 01-backend-fundamentals/
│   ├── 01-project-setup/
│   ├── 02-http-server/
│   ├── 03-express-server/
│   ├── 04-routing/
│   ├── 05-pagination-filtering-search-sorting/
│   └── ...
├── 02-applied-ai-engineering/
│   ├── 01-hosted-llm-api/
│   └── ...
├── 03-distributed-systems/
│   ├── 01-load-balancer/
│   └── ...
└── 04-ai-agents/
    ├── 01-agent-tool-loop/
    └── ...
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

------------------------------------------------------------------------

# Completion Tracker

## Backend Fundamentals

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

## Applied AI Engineering

- [ ] Project 1 --- Hosted LLM API Integration
- [ ] Project 2 --- Embeddings
- [ ] Project 3 --- Cosine Similarity
- [ ] Project 4 --- Chunking
- [ ] Project 5 --- Vector Search
- [ ] Project 6 --- Retrieval-Augmented Generation
- [ ] Project 7 --- Function / Tool Calling
- [ ] Project 8 --- Structured Output
- [ ] Project 9 --- Reusable AI Harness
- [ ] Project 10 --- Streaming Responses
- [ ] Project 11 --- Prompt Caching
- [ ] Project 12 --- AI Application Evaluation
- [ ] Project 13 --- Prompt Versioning
- [ ] Project 14 --- Batch LLM Requests
- [ ] Project 15 --- Guardrails and Safety Evaluation

## Distributed Systems

- [ ] Project 1 --- Load Balancer
- [ ] Project 2 --- Distributed Cache
- [ ] Project 3 --- Retry Logic
- [ ] Project 4 --- Rate Limiting
- [ ] Project 5 --- Circuit Breaker
- [ ] Project 6 --- Pub/Sub
- [ ] Project 7 --- Eventual Consistency
- [ ] Project 8 --- Replication
- [ ] Project 9 --- Sharding
- [ ] Project 10 --- Distributed Tracing
- [ ] Project 11 --- Distributed Locks
- [ ] Project 12 --- Leader Election
- [ ] Project 13 --- Service Discovery
- [ ] Project 14 --- Health and Readiness Checks
- [ ] Project 15 --- Graceful Shutdown
- [ ] Project 16 --- Autoscaling Experiment
- [ ] Project 17 --- Consistent Hashing

## AI Agents

- [ ] Project 1 --- Agent Tool Loop
- [ ] Project 2 --- Conversation Memory
- [ ] Project 3 --- Reflection / Critique
- [ ] Project 4 --- Planning
- [ ] Project 5 --- Multi-Agent Coordination
- [ ] Project 6 --- Workflow Graphs
- [ ] Project 7 --- Human Approval
- [ ] Project 8 --- Long-Term Memory
