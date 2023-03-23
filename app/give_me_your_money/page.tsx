"use client"

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import VirtualOSBrowserCore, {  }  from "../../supabase/index"
import { useRouter } from "next/navigation";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<Link color="inherit" href="https://mui.com/">
				ThinkMay
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

export default function SignIn() {
	//const { isUserAuthenticated, user } = useAuth();
	const router = useRouter();

	//React.useEffect(() => {
	//	if (isUserAuthenticated()) {
	//		// router.push('/')
	//		// router.replace(`/`);
	//		console.log("chang roue");
	//	}
	//}, [user]);

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
						<PayPalScriptProvider options={{
							"client-id": "AdxCRX7LxtFK0cPQMNwaK7k_0f3zo9ss582ggaFZyuWrsvxzf-KZ5EZMeJKnEcKNMj6pmi2TU_Oa5N5M",
							// "data-client-token": "EJPWK-KL1eYYndvnq_3p4vby028oN8ICwWmWd-UvNyFq35_oZR257bUgaHGC8MVtzrUWd1gM4d_H2BsI",
						}}>
							<PayPalButtons
								createOrder={(data, actions) => {
									return actions.order.create({
										purchase_units: [
											{
												amount: {
													value: "0.99",
												}
											}
										]
									});
								}}
								onApprove={(data, actions) => {
									return actions.order.capture().then(function (details){
										alert("Transaction completed by" + details.payer.name.given_name)
									});
								}}
							/>
					</PayPalScriptProvider>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}

