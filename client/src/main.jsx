import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import AuthContextProvider from './context/AuthContext.jsx';
import ShopContextProvider from './context/ShopContext.jsx';
import NotificationContextProvider from "./context/NotificationContext.jsx";
import { LanguageProvider } from './context/LanguageContext.jsx';

import './i18n.js';

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
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
    </React.StrictMode>,
)
