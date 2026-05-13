import { Link } from 'react-router-dom';

import './ActionButton.css';

export default function ActionButton({
    type = 'button',
    to,
    onClick,
    disabled = false,
    variant = 'edit',
    title,
    icon
}) {
    // Combine base class with variant and disabled state
    const className = `
        action-btn 
        ${variant}-btn 
        ${disabled ? 'disabled' : ''}
    `;

    // If it's a link, render a Link component; otherwise, render a button
    if (type === 'link') {
        return (
            <Link
                to={disabled ? '#' : to}
                className={className}
                title={title}
                onClick={(e) => disabled && e.preventDefault()}
            >
                {icon}
            </Link>
        );
    }

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {icon}
        </button>
    );
}