import { Link } from 'react-router-dom';

import './Sidebar.css';
import add_product_icon from '../assets/Product_Cart.svg';
import list_product_icon from '../assets/Product_list_icon.svg';
import edit_pencil_icon from '../assets/pencil_edit.svg';
import delete_trash_icon from '../assets/delete_trash.svg';
import add_promocode_icon from '../assets/add_promocode_icon.svg';
import list_promocodes_icon from '../assets/discount-coupon.svg';

const sidebarLinks = [
    // product links
    { path: '/add-product', label: 'Add Product', icon: add_product_icon },
    { path: '/list-products', label: 'List Products', icon: list_product_icon },
    { path: '/list-products', label: 'Edit Product', icon: edit_pencil_icon },
    { path: '/list-products', label: 'Delete Product', icon: delete_trash_icon },

    // promocode links
    { path: '/add-promocode', label: 'Add Promocode', icon: add_promocode_icon },
    { path: '/list-promocodes', label: 'List Promocodes', icon: list_promocodes_icon },
];

export default function Sidebar() {
    return (
        <div className="sidebar">
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