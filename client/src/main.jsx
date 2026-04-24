import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AuthContextProvider from './context/AuthContext.jsx';
import ShopContextProvider from './context/ShopContext.jsx';
import NotificationContextProvider from "./context/NotificationContext.jsx";
import { LanguageProvider } from './context/LanguageContext.jsx';

import './i18n.js';

import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <LanguageProvider>
                    <AuthContextProvider>
                        <ShopContextProvider>
                            <NotificationContextProvider>
                                <App />
                            </NotificationContextProvider>
                        </ShopContextProvider>
                    </AuthContextProvider>
                </LanguageProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
