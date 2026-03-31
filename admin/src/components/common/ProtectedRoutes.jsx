import { useContext } from "react";
import { Outlet } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

import Warning from "../warning/Warning";

export default function ProtectedRoutes() {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) 
        return null; 

    return isAuthenticated ? <Outlet /> : <Warning />;
}