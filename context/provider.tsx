"use client"

import { SupabaseProvider } from "./authContext";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createServerClient } from "../supabase/supabase-server";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Analytics } from "@vercel/analytics/react";

const theme = createTheme({
	typography: {
		//fontSize: 12,
	},
	components: {
		// Name of the component
		MuiButton: {
			styleOverrides: {
				// Name of the slot
				root: {
					// Some CSS
					fontSize: '1.2rem',
				},
			},
		},
	},
});
function Provider({ children, session }) {
	return (
		<SupabaseProvider session={session}>
			<GoogleAnalytics trackPageViews />
			<Analytics />
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</SupabaseProvider>
	);
}

export default Provider;