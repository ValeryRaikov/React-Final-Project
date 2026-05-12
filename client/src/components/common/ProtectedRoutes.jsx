import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProtectedRoutes() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        // If the user is authenticated, render the child routes (Outlet), otherwise redirect to login page
        isAuthenticated 
            ? <Outlet />
            : <Navigate to='/login' />
    );
}