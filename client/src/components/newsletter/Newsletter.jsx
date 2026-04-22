import './Newsletter.css';
import { useTranslation } from 'react-i18next';

export default function Newsletter() {
    const { t } = useTranslation('forms');
    
    return (
        <div className="newsletter">
            <h1>{t('getExclusiveOffers')}</h1>
            <p>{t('subscribeNewsletter')}</p>
            <div>
                <input type="email" placeholder={t('yourEmail')} />
                <button>{t('subscribe')}</button>
            </div>
        </div>
    );
}