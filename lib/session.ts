import { db } from "./db";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cache } from "react";
import { cookies } from "next/headers";

import type { User } from "./user";

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const query = `
		SELECT 
			session.id, 
			session.user_id, 
			session.expires_at, 
			"user".id AS user_id, 
			"user".github_id, 
			"user".email, 
			"user".username
		FROM session
		INNER JOIN "user" ON session.user_id = "user".id
		WHERE session.id = $1
	`;

	const result = await db.query(query, [sessionId]);

	const row = result.rows[0]

	if (row === null || row === undefined) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: row.id,
		userId: row.userId,
		expiresAt: new Date(row.expires_at * 1000)
	};
	const user: User = {
		id: row.id,
		githubId: row.githubId,
		email: row.email,
		username: row.username
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.query("DELETE FROM session WHERE id = $1", [session.id]);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db.query(
			"UPDATE session SET expires_at = $1 WHERE id = $2",
			[
			  Math.floor(session.expiresAt.getTime() / 1000),
			  session.id
			]
		  );
	}
	return { session, user };
}

export const getCurrentSession = cache( async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validateSessionToken(token);
	return result;
});

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.query("DELETE FROM session WHERE id = $1", [sessionId]);
}

export async function invalidateUserSessions(userId: number): Promise<void> {
	await db.query("DELETE FROM session WHERE user_id = $1", [userId]);
}

export async function setSessionTokenCookie(token: string, expiresAt: Date){
	const cookieStore = await cookies();
    cookieStore.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: expiresAt
	});
}

export async function deleteSessionTokenCookie() {
	const cookieStore = await cookies();
    cookieStore.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await db.query(
		"INSERT INTO \"session\" (id, user_id, expires_at) VALUES ($1, $2, $3)",
		[
		  session.id,
		  session.userId,
		  Math.floor(session.expiresAt.getTime() / 1000)
		]
	  );
	return session;
}

export interface Session {
	id: string;
	expiresAt: Date;
	userId: number;
}

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
