import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import './About.css';
import hand_icon from '../assets/hand_icon.png';

export default function About() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation(['navigation', 'pages']);
    
    const sidebarLinks = [
        { path: "company", label: t('navigation:company') },
        { path: "products", label: t('navigation:products') },
        { path: "offices", label: t('navigation:offices') },
        { path: "about-us", label: t('navigation:aboutUs') },
        { path: "contact", label: t('navigation:contact') },
    ];

    const currentPath = location.pathname.split("/").pop() || 'company';
    const isSidebarLinkSelected = sidebarLinks.some(link => link.path === currentPath);

    return (
        <div className="about">
            <div className="about-sidenav">
                {sidebarLinks.map((link) => (
                    <span
                        key={link.path}
                        className={currentPath === link.path ? 'active' : ''}
                    >
                        <Link to={link.path}>{link.label}</Link>
                    </span>
                ))}
            </div>

            <div className="about-content-container">
                {!isSidebarLinkSelected
                    ? (
                        <div className="about-content">
                            <h1>{t('pages:allAboutShopify')}</h1>

                            <div className="about-content-description">
                                <img src={hand_icon} alt="" />
                                <div className="about-text">
                                    <p>{t('pages:aboutSection')}</p>
                                    <p>{t('pages:useNavigation')}</p>
                                </div>
                            </div>
                            <div className="about-btn">
                                <button onClick={() => navigate('/')}>{t('pages:goBack')}</button>
                            </div>
                        </div>
                    )
                    : <Outlet />
                }
            </div>
        </div>
    );
}
