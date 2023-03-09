import { Typography } from "@mui/material";
import * as React from "react";
import { useAuth } from "../context/authContext";
import { VirtualOSBrowserCore } from "../supabase";

function DashBroad() {
    const { user } = useAuth();
    console.log(user);
    return (
        <>
            <Typography> This is a DrashBroad</Typography>
        </>
    );
}

export default DashBroad;
