CREATE TABLE session (
    id CHAR(64) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at BIGINT NOT NULL
);