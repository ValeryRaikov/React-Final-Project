import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './Warning.css';

export default function Warning() {
    const { t } = useTranslation('auth');

    return (
        <div className="error-box">
            <h1>{t('warning')}</h1>
            <Link to="/admin-login">
                <button>{t('login')}</button>
            </Link>
        </div>
    );
}