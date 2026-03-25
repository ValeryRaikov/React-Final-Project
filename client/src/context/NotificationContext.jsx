import { createContext, useContext, useState } from 'react';

import NotificationContainer from '../components/notification-container/NotificationContainer.jsx';

const NotificationContext = createContext();

export default function NotificationContextProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'success') => {
        const id = Date.now();

        setNotifications(prev => [...prev, { id, message, type }]);

        // auto remove after 3s
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

export const useNotification = () => useContext(NotificationContext);