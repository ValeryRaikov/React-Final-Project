import './Breadcrum.css';
import { useTranslation } from 'react-i18next';
import arrow_icon from '../assets/breadcrum_arrow.png';

export default function Breadcrum({
    name,
    category,
}) {
    const { t } = useTranslation('pages');
    
    return (
        <div className="breadcrum">
            {t('home')} <img src={arrow_icon} alt="" />
            {t('shop')} <img src={arrow_icon} alt="" />
            {category} <img src={arrow_icon} alt="" /> {name}
        </div>
    );
}