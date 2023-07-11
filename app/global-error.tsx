'use client'

import { useEffect } from "react"

export default function GlobalError({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])
	return (
		<html>
			<body>
				<h2>Some thing went wrong. See the console.log</h2>
				<button onClick={() => reset()}>Try again</button>
			</body>
		</html>
	)
}