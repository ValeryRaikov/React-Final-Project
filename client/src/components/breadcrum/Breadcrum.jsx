import './Breadcrum.css';
import { useTranslation } from 'react-i18next';
import arrow_icon from '../assets/breadcrum_arrow.png';

export default function Breadcrum({
    name,
    category,
}) {
    const { t } = useTranslation(['pages', 'products']);
    
    return (
        <div className="breadcrum">
            {t('pages:home')} <img src={arrow_icon} alt="" />
            {t('pages:shop')} <img src={arrow_icon} alt="" />
            {t(`products:${category}`)} <img src={arrow_icon} alt="" /> {name}
        </div>
    );
}