import { useTranslation } from 'react-i18next';

import './Home.css';

export default function Home() {
    const { t } = useTranslation('others');

    return (
        <div className="home">
            <h1>{t('welcome')}</h1>
        </div>
    );
}