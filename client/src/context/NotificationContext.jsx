// context/NotificationContext.jsx - Provides notification state and functions to the app using React Context API

import { createContext, useContext, useState } from 'react';

import NotificationContainer from '../components/notification-container/NotificationContainer.jsx';

// Create a context for notification management
const NotificationContext = createContext();

// NotificationContextProvider component to wrap the app and provide notification state and functions
export default function NotificationContextProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    // Function to add a new notification with auto-removal after 3 seconds
    const addNotification = (message, type = 'success') => {
        const id = Date.now();

        setNotifications(prev => [...prev, { id, message, type }]);

        // auto remove after 3s (3000 ms)
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <NotificationContainer notifications={notifications} />
        </NotificationContext.Provider>
    );
}

// Custom hook to use the NotificationContext
export const useNotification = () => useContext(NotificationContext);