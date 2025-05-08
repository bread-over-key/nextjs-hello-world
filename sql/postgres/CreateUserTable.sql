CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    github_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    username TEXT NOT NULL
);