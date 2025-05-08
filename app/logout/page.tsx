import { getCurrentSession, invalidateSession, deleteSessionTokenCookie } from "@/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function logout(): Promise<void> {
	"use server";
	const { session } = await getCurrentSession();
	if (!session) {
		// return {
		// 	error: "Unauthorized"
		// };
        return;
	}

	await invalidateSession(session.id);
	await deleteSessionTokenCookie();
	// return redirect("/login");
}

interface ActionResult {
	error: string | null;
}

export default async function Page() {
	return (
		<form action={logout}>
			<button>Sign out</button>
		</form>
	);
}