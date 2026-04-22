import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './Footer.css';
import footer_logo from '../assets/logo_big.png';
import instagram_icon from '../assets/instagram_icon.png';
import pinterest_icon from '../assets/pinterest_icon.png';
import whatsapp_icon from '../assets/whatsapp_icon.png';

export default function Footer() {
    const navigate = useNavigate();
    const { t } = useTranslation('navigation');

    return (
        <div className="footer">
            <div className="footer-logo">
                <img src={footer_logo} alt="" />
                <p>Shopify</p>
            </div>
            <ul className="footer-links">
                <li onClick={() => navigate('/about/company')}>{t('company')}</li>
                <li onClick={() => navigate('/about/products')}>{t('products')}</li>
                <li onClick={() => navigate('/about/offices')}>{t('offices')}</li>
                <li onClick={() => navigate('/about/about-us')}>{t('aboutUs')}</li>
                <li onClick={() => navigate('/about/contact')}>{t('contact')}</li>
            </ul>
            <div className="footer-socials-icons">
                <div className="footer-icons-container">
                    <img src={instagram_icon} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={pinterest_icon} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={whatsapp_icon} alt="" />
                </div>
            </div>
            <div className="footer-copyright">
                <hr />
                <p>{t('copyright')}</p>
            </div>
        </div>
    );
}
