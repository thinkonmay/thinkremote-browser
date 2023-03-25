"use client"
import { Container, Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import VirtualOSBrowserCore from "../../supabase";
import HeaderDashBoard from "./header";
import NavBarDashBoard from "./navbar";

interface Props{
	children: React.ReactNode
	// core: VirtualOSBrowserCore
}
function LayoutDashBoard(props: Props) {
	const {children} = props
	const [core,setcore] = useState<VirtualOSBrowserCore>(new VirtualOSBrowserCore())
	useEffect(() => {
		setcore(new VirtualOSBrowserCore())
	},[])

	
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
						<NavBarDashBoard
							core={core}
						/>
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