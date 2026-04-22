import { useTranslation } from 'react-i18next';

import './AboutUs.css';
import hero_image from '../assets/hero_image.png';

export default function AboutUs() {
    const { t } = useTranslation('about');

    return (
        <div className="about-us">
            <h2>{t('aboutUs')}</h2>
            <div className="about-us-container">
                <div className="container-description">
                    <p>{t('aboutParagraph1')}</p>
                    <p>{t('aboutParagraph2')}</p>
                    <p>{t('aboutParagraph3')}</p>
                </div>
                <img src={hero_image} alt="" />
            </div>
        </div>
    );
}