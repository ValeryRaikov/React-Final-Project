import './Hero.css';
import hand_icon from '../assets/hand_icon.png';
import arrow_icon from '../assets/arrow.png';
import hero_image from '../assets/hero_image.png';
import { useTranslation } from 'react-i18next';

export default function Hero() {
    const { t } = useTranslation('homepage');
    return (
        <div className="hero">
            <div className="hero-left">
                <h2>{t('latestArrivalsOnly')}</h2>
                <div>
                    <div className="hero-hand-icon">
                        <p>{t('new')}</p>
                        <img src={hand_icon} alt="" />
                    </div>
                    <p>{t('collections')}</p>
                    <p>{t('forEverybody')}</p>
                </div>
                <div className="hero-latest-btn">
                    <div>{t('latestCollection')}</div>
                    <img src={arrow_icon} alt="" />
                </div>
            </div>
            <div className="hero-right">
                <img src={hero_image} alt="" />
            </div>
        </div>
    );
}