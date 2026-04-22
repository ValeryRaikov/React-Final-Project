import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './NotFound.css';
import not_found from '../assets/404.png';

export default function NotFound() {
    const { t } = useTranslation(['others', 'pages']);

    const navigate = useNavigate();

    return (
        <div className="not-found">
            <div className="not-found-box">
                <img src={not_found} alt="" />
                <h3>{t('others:404notFound')}</h3>
                <button onClick={() => navigate(-1)}>{t('pages:goBack')}</button>
            </div>
            <hr />
        </div>
    );
}