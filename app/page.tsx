import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export default async function Page() {
	const { user } = await getCurrentSession();
	if (user === null) {
		return redirect("/login");
	}
	return (

		<div>
			<h1>Hi, {user.username}!</h1>
			<a href="/logout">logout</a>
		</div>
	)
}
