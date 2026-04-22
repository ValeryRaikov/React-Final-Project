import './Contact.css';
import instagram_icon from '../assets/instagram_icon.png';
import pinterest_icon from '../assets/pinterest_icon.png';
import whatsapp_icon from '../assets/whatsapp_icon.png';
import { useTranslation } from 'react-i18next';

export default function Contact() {
    const { t } = useTranslation('contact');
    
    return (
        <div className="contact">
            <h2>{t('contacts')}</h2>
            <div className="contact-email">
                <i className="fa-solid fa-envelope"></i>
                <p>{t('email')}</p>
            </div>
            <div className="contact-phone">
                <i className="fa-solid fa-phone"></i>
                <p>{t('phone')}</p>
            </div>
            <div className="contact-socials-icons">
                <h2>{t('followUs')}</h2>
                <img src={instagram_icon} alt="" />
                <img src={pinterest_icon} alt="" />
                <img src={whatsapp_icon} alt="" />
            </div>
        </div>
    );
}