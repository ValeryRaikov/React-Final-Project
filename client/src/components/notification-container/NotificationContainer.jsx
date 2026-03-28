import './NotificationContainer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function NotificationContainer({ notifications }) {
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return faCheckCircle;
            case 'warning':
                return faExclamationTriangle;
            case 'error':
                return faTimesCircle;
            default:
                return null;
        }
    };

    return (
        <div className="notification-container">
            {notifications.map(n => (
                <div key={n.id} className={`notification ${n.type}`}>
                    <span className="notification-icon">
                        <FontAwesomeIcon icon={getIcon(n.type)} />
                    </span>
                    <span className="notification-message">
                        {n.message}
                    </span>
                </div>
            ))}
        </div>
    );
}