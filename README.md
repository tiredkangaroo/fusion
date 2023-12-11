# Fusion is a collaboration-focused app for next-generation teams around the world 🌎.

This app is made using: <b>TypeScript</b>, <b>NodeJS</b>, <b>React</b>, <b>PostgreSQL</b>, and <b>TailwindCSS</b>.

## Installation Guide (development only)
### 1. Pre-requisites

You should have the `typescript` node module installed globally on your computer. If it is not there, please run `npm i -g typescript`.

You must have `postgres` installed on your computer (preferrably 14.10). You may check installation instructions <a href="https://www.postgresql.org/download/">here</a>.

You should also create a database named `fusion` with default postgres ports.

### 2. You must clone the repository using the method you prefer.

Using the `git` command:
`git clone https://github.com/tiredkangaroo/fusion.git`


### 3. Install Dependencies

Make your working directory fusion/frontend and run `npm i` to install the dependencies.

Once that is completed, make the working directory fusion/backend and run `npm i && tsc" to compile and install the backend.

### 4. Run the App

In one terminal with the working directory as fusion/frontend, run `npm run dev`.

In another terminal with the working directory as fusion/backend, run `npm run dev`.

You may then reach [your frontend](http://localhost:5137) through localhost.

Note: It may take a while for both servers to fully start up.
