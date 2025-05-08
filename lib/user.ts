import { db } from "./db";

export async function createUser(githubId: number, email: string, username: string): Promise<User> {
	const query = await db.query(
		"INSERT INTO \"user\" (github_id, email, username) VALUES ($1, $2, $3) RETURNING id",
		[githubId, email, username]
	  );
	
	const row = query.rows[0];

	if (row === null || row === undefined) {
		throw new Error("Unexpected error");
	}
	const user: User = {
		id: row.id,
		githubId,
		email,
		username
	};
	return user;
}

export async function getUserFromGitHubId(githubId: number): Promise<User | null> {
	const query = await db.query(
		"SELECT id, github_id, email, username FROM \"user\" WHERE github_id = $1",
		[githubId]
	  );
	
	const row = query.rows[0];
	
	if (row === null || row === undefined) {
		return null;
	}
	const user: User = {
		id: row.id,
		githubId: row.githubId,
		email: row.email,
		username: row.username
	};
	return user;
}


export interface User {
	id: number;
	githubId: number;
	username: string;
    email: string;
}
