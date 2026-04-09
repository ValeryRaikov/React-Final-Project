import { createContext, useState, useEffect } from 'react';
import { BASE_URL } from '../components/services/utils.js'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        admin: null,
        loading: true, 
    });

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('auth-token');

            if (!token) {
                setAuth({ isAuthenticated: false, user: null, admin: null, loading: false });
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/admin-verify`, {
                    headers: { 'auth-token': token },
                });

                if (res.ok) {
                    const data = await res.json();
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
                    setAuth({ isAuthenticated: false, user: null, admin: null, loading: false });
                }
            } catch (err) {
                console.error('Token validation failed:', err);
                setAuth({ isAuthenticated: false, user: null, admin: null, loading: false });
            }
        };

        validateToken();
    }, []);

    const login = (token, user) => {
        localStorage.setItem('auth-token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuth({ isAuthenticated: true, user, admin: user, loading: false });
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
        setAuth({ isAuthenticated: false, user: null, admin: null, loading: false });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {!auth.loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;