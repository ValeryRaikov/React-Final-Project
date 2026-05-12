// context/AuthContext.jsx - Authentication context for admin panel, managing auth state and token validation

import { createContext, useState, useEffect } from 'react';
import { BASE_URL } from '../components/services/utils.js'; 

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap the app and provide authentication state and functions
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        admin: null,
        loading: true, 
    });

    // Validate token on initial load to check if user is already authenticated
    useEffect(() => {
        const validateToken = async () => {
            // Get token from localStorage
            const token = localStorage.getItem('auth-token');

            // If no token, user is not authenticated
            if (!token) {
                setAuth({ 
                    isAuthenticated: false, 
                    user: null, 
                    admin: null, 
                    loading: false 
                });

                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/admin-verify`, {
                    headers: { 'auth-token': token },
                });

                if (res.ok) {
                    const data = await res.json();

                    // If token is valid, set auth state with user data
                    setAuth({
                        isAuthenticated: true,
                        user: data.user,
                        admin: data.user,
                        loading: false,
                    });
                } else {
                    // Token invalid – clear storage
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('user');
                    setAuth({ 
                        isAuthenticated: false, 
                        user: null, 
                        admin: null, 
                        loading: false 
                    });
                }
            } catch (err) {
                console.error('Token validation failed:', err);
                setAuth({ isAuthenticated: false, user: null, admin: null, loading: false });
            }
        };

        // Call token validation on component mount
        validateToken();
    }, []);

    // Login function to save token and user data on successful login
    const login = (token, user) => {
        localStorage.setItem('auth-token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setAuth({ 
            isAuthenticated: true, 
            user, 
            admin: user, 
            loading: false 
        });
    };

    // Logout function to clear token and user data
    const logout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');

        setAuth({ 
            isAuthenticated: false, 
            user: null, 
            admin: null, 
            loading: false 
        });
    };

    // Provide auth state and functions to children components
    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {!auth.loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;