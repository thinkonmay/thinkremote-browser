'use client'

import { useEffect } from "react"
import styled from "styled-components";

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
			<Body>
				<h2>Some thing went wrong. </h2>
				<h2>{error?.name}</h2>
				<h2>{error?.message}</h2>
				<h2>{error?.stack}</h2>
				<button onClick={() => reset()}>Try again</button>
			</Body>
		</html>
	)
}

const Body = styled.body`
	display: flex;
	flex-direction: column;
	gap: 14px;
	align-items: center;
	justify-content: center;

	width: 100vw;
	height: 100vh;


`