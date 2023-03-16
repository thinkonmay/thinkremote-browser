import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { default as NextLink } from "next/link";
import { AppRoutes } from "../constants/appRoutes";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	email: Yup.string()
		.required('Email is required')
		.email('Email is invalid'),
	password: Yup.string()
		.required('Password is required')
		.min(6, 'Password must be at least 6 characters')
		.max(40, 'Password must not exceed 40 characters'),
	confirmPassword: Yup.string()
		.required('Confirm Password is required')
		.oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
})
function Copyright(props: any) {
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

export default function SignUp() {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(validationSchema)
	});

	//const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	//	event.preventDefault();
	//	const data = new FormData(event.currentTarget);
	//	console.log({
	//		email: data.get("email"),
	//		password: data.get("password"),
	//	});
	//};
	const onSubmit = (data) => {
		console.log(data);
	}
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
						Sign up
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit(e => onSubmit(e))}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									{...register('email')}
									error={errors.email ? true : false}
								/>
								<Typography variant="inherit" color="textSecondary">
									{errors.email?.message}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									{...register('password')}
									error={errors.password ? true : false}
								/>
								<Typography variant="inherit" color="textSecondary">
									{errors.password?.message}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type="password"
									id="confirmPassword"
									autoComplete="confirmPassword"
									{...register('confirmPassword')}
									error={errors.confirmPassword ? true : false}
								/>
								<Typography variant="inherit" color="textSecondary">
									{errors.confirmPassword?.message}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={
										<Checkbox
											value="allowExtraEmails"
											color="primary"
										/>
									}
									label="I want to receive inspiration, marketing promotions and updates via email."
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								{/* <Link variant="body2"> */}
								<NextLink href={AppRoutes.SIGN_IN}>
									Already have an account? Sign in
								</NextLink>
								{/* </Link> */}
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Container>
		</ThemeProvider>
	);
}
