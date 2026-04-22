import './Offers.css';
import exclusive_image from '../assets/exclusive_image.png';
import { useTranslation } from 'react-i18next';

export default function Offers() {
    const { t } = useTranslation('homepage');
    
    return (
        <div className="offers">
            <div className="offers-left">
                <h1>{t('exclusive')}</h1>
                <h1>{t('offersForYou')}</h1>
                <p>{t('onlyOnBestSellers')}</p>
                <button>{t('checkNow')}</button>
            </div>
            <div className="offers-right">
                <img src={exclusive_image} alt="" />
            </div>
        </div>
    );
}