import './NotificationContainer.css';

export default function NotificationContainer({ notifications }) {
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return '✔ ';
            case 'warning':
                return '❗ ';
            case 'error':
                return '❌ ';
            default:
                return '';
        }
    };

    return (
        <div className="notification-container">
            {notifications.map(n => (
                <div key={n.id} className={`notification ${n.type}`}>
                    <span className="notification-icon">
                        {getIcon(n.type)}
                    </span>
                    <span className="notification-message">
                        {n.message}
                    </span>
                </div>
            ))}
        </div>
    );
}