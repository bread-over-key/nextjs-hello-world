import { getCurrentSession, invalidateSession, deleteSessionTokenCookie } from "@/lib/session";

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

export default async function Page() {

	console.log("process.env.TEST - login")
	console.log(process.env.TEST)

	return (
		<form action={logout}>
			<button>Sign out</button>
		</form>
	);
}