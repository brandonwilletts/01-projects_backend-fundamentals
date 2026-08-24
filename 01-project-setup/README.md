# 01-project-setup

#### Create and clone GitHub repository

#### Create README.md and .gitignore

Add, \*.env, \*.env.\*, !.env.example, and node_modules/ to `.gitignore`.

#### Configure Node.js

Node.js: A program that lets you run JavaScript outside of a web browser.

Node Types: Provides TypeScript with type definitions for Node.js APIs such as process, fs, path, and http, so TypeScript understands how they work.

Verify Node.js and npm installation:
`node -v`
`npm -v`

Install Node Types:
`npm install -D @types/node`

Initialize a new Node.js project and generate `package.json`:
`npm init`

#### Install TypeScript and TSX

TypeScript (TSC): Checks types and compiles (TSC) TypeScript to JavaScript.
TSX: Runs TypeScript files directly during development.

Install TypeScript and TSX:
`npm install -D typescript tsx`

Confirm TypeScript installed:
`tsc -v`

Initialize TypeScript and generate `tsconfig.json`:
`npx tsc --init`

Configure `package.json`:

- "type": "module"

Configure`tsconfig.json`:

- "types": ["node"]

#### Create /src and /tests folders

#### Install and configure dotenv and cross-env

dotenv: A library that loads configuration values from a file called .env into your Node.js application.

cross-env: A utility that lets you set environment variables like NODE_ENV=test in npm scripts in a way that works on Windows, macOS, and Linux

We want to have separate .env files that load different variables depending on the node environment.

We accomplish this by using dotenv to create a config object (containing values loaded from .env) in config.ts and exporting it to be used throughout the application. This centralizes our .env variables and allows us to make updates in one place (instead of having them hard-coded everywhere).

We set the node environment in our npm scripts in `package.json` using `cross-env NODE_ENV=""`.

Install dotenv:
`npm install dotenv`

Install cross-env:
`npm install -D cross-env`

Create and configure .env and .env.test:

- Create .env, .env.test, and .env.example
- Ensure .env and .env.test are ignored by `.gitignore`

Create `config.ts`, configure dotenv, and export typed config object.

#### Install and configure ESLint

ESLint: Analyzes your code for errors, potential bugs, and violations of coding rules.

Install ESLint and the TypeScript support packages (note: have to fallback to TS v5 due to compatibility issues):
`npm install -D typescript@5 eslint typescript-eslint`

Initialize ESLint and generate `eslint.config.js` and `eslint.config.ts`:
`npx eslint --init`

Add script to `package.json`:
"scripts": {
"lint": "eslint ."
}

Test run:
`npm run lint`

#### Install and configure Prettier

Prettier: Automatically formats your code to enforce a consistent style.

Install Prettier:
`npm install -D prettier`

Create and configure Prettier configuration file `.prettierrc`.

Create`.prettierignore` to tell Prettier to ignore certain files:

- node_modules/

Add script to `package.json`:
"scripts": {
"format": "prettier --write ."
}

Test run:
`npm run format`

#### To copy to future projects, simply copy / paste the files and run `npm install`