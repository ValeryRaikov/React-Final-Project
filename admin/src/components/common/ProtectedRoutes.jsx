import { useContext } from "react";
import { Outlet } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

import Warning from "../warning/Warning";

export default function ProtectedRoutes() {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) 
        return null; 

    // If the user is authenticated, render the child routes; otherwise, show a warning message
    return isAuthenticated ? <Outlet /> : <Warning />;
}