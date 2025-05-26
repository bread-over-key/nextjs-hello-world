'use client'

const Page = async () => {

	console.log("process.env.TEST - login")
	console.log(process.env.TEST)

	return (
		<>
			<h1>Sign in</h1>
			<a href="/login/github">Sign in with GitHub</a>

			<button onClick={() => fetch('/api/hello')}>Trigger Env Log</button>
			<button>hello</button>
		</>
	);
};

export default Page;