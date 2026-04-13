import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './NotFound.css';
import not_found from '../assets/404.png';

export default function NotFound() {
    const navigate = useNavigate();

    const { t } = useTranslation(['common', 'others']);

    return (
        <div className="not-found">
            <div className="not-found-box">
                <img src={not_found} alt="" />
                <h3>{t('others:pageNotFound')}</h3>
                <button onClick={() => navigate('/')}>{t('common:back')}</button>
            </div>
        </div>
    );
}