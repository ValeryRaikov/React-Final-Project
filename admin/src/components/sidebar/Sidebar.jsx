import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

import './Sidebar.css';
import add_product_icon from '../assets/cart.svg';
import list_product_icon from '../assets/checklist.svg';
import add_admin_icon from '../assets/administrator.svg';
import list_admin_icon from '../assets/contact-book.svg';
import add_promocode_icon from '../assets/add_promocode_icon.svg';
import list_promocode_icon from '../assets/discount-coupon.svg';

export default function Sidebar() {
    const { admin } = useContext(AuthContext);
    const { t } = useTranslation();

    const baseLinks = [
        // product links
        { path: '/add-product', labelKey: 'navigation:addProduct', icon: add_product_icon },
        { path: '/list-products', labelKey: 'navigation:listProducts', icon: list_product_icon },

        // promocode links
        { path: '/add-promocode', labelKey: 'navigation:addPromocode', icon: add_promocode_icon },
        { path: '/list-promocodes', labelKey: 'navigation:listPromocodes', icon: list_promocode_icon },
    ];

    // User management links - only for superadmin and admin
    const userLinks = [
        { path: '/add-user', labelKey: 'navigation:addUser', icon: add_admin_icon },
        { path: '/list-users', labelKey: 'navigation:listUsers', icon: list_admin_icon },
    ];
    
    // Only show user management links to superadmin and admin
    const sidebarLinks = admin && admin.role !== 'operator' 
        ? [...baseLinks, ...userLinks] 
        : baseLinks;

    return (
        <div className="sidebar">
            <h3 className="sidebar-title">{t('navigation:dashboard')}</h3>
            
            {sidebarLinks.map((link, idx) => (
                <Link to={link.path} key={idx} style={{textDecoration: "none"}}>
                    <div className="sidebar-item">
                        <img src={link.icon} alt="" />
                        <p>{t(link.labelKey)}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}