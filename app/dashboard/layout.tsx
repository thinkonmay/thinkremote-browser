"use client"
import { Container, Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import HeaderDashBoard from "./header";
import NavBarDashBoard from "./navbar";

interface Props{
	children: React.ReactNode
}
function LayoutDashBoard(props: Props) {
	const {children} = props
	return (
		<Box 
			sx={{
				//bgcolor: '#f4f5f7'
			}}
			>	
			<Box 
				sx={{
					position: 'fixed',
					zIndex: 2,
					top: 0,
					right: 0,
					width: '100vw',
					height: '80px'
				}}
				>
				<HeaderDashBoard/>
			</Box>
			<Container maxWidth={'xl'} sx={{mt: '120px'}}>
				<Grid container spacing={3}>
					<Grid item xs={2}>
						<NavBarDashBoard/>
					</Grid>
					<Grid item xs={10}>
						{children}
					</Grid>
				</Grid>
			</Container>
		</Box>
	  );
}

export default LayoutDashBoard;