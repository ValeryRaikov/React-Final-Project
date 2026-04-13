import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
