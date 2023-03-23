"use client"

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import { IconButton } from "@mui/material";
import VirtualOSBrowserCore  from "../../supabase/index"
import { useRouter } from "next/navigation";

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

	const clientSupabase = new VirtualOSBrowserCore();
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
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Grid
						container
						justifyContent={"center"}
						alignItems="center"
					>
						<Grid item xs={"auto"}>
							<IconButton
								onClick={async () => {
									await clientSupabase.LoginWithGoogle()
								}}
							>
								<GoogleIcon
									sx={{ fontSize: 30 }}
									color="primary"
								/>
							</IconButton>
						</Grid>
					</Grid>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}

