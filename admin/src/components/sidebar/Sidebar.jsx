import { Link } from 'react-router-dom';

import './Sidebar.css';
import add_product_icon from '../assets/cart.svg';
import list_product_icon from '../assets/checklist.svg';
import add_admin_icon from '../assets/administrator.svg';
import list_admin_icon from '../assets/contact-book.svg';
import add_promocode_icon from '../assets/add_promocode_icon.svg';
import list_promocode_icon from '../assets/discount-coupon.svg';

const sidebarLinks = [
    // product links
    { path: '/add-product', label: 'Add Product', icon: add_product_icon },
    { path: '/list-products', label: 'List Products', icon: list_product_icon },

    // admin links
    { path: '/add-admin', label: 'Add Admin', icon: add_admin_icon },
    { path: '/list-admins', label: 'List Admins', icon: list_admin_icon },

    // promocode links
    { path: '/add-promocode', label: 'Add Promocode', icon: add_promocode_icon },
    { path: '/list-promocodes', label: 'List Promocodes', icon: list_promocode_icon },
];

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h3 className="sidebar-title">Admin Dashboard</h3>
            {sidebarLinks.map((link, idx) => (
                <Link to={link.path} key={idx} style={{textDecoration: "none"}}>
                    <div className="sidebar-item">
                        <img src={link.icon} alt="" />
                        <p>{link.label}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}