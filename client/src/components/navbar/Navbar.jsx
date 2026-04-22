import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../context/AuthContext';
import { ShopContext } from '../../context/ShopContext';
import { useLanguage } from '../../context/LanguageContext';

import './Navbar.css';
import logo from '../assets/logo.png';
import cart_icon from '../assets/cart_icon.png';
import saved_icon from '../assets/saved_icon.png';
import profile_icon from '../assets/profile_icon.png';

export default function Navbar() {
    const { isAuthenticated, handleLogout } = useContext(AuthContext);
    const { clearCart, clearSavedItems, getTotalCartItems, getTotalSavedItems } = useContext(ShopContext);
    const { t } = useTranslation(['navigation', 'products']);
    const { currentLanguage, changeLanguage } = useLanguage();

    const navigate = useNavigate();
    const [menu, setMenu] = useState('shop');

    const logoutHandler = () => {
        localStorage.removeItem('auth-token');
        handleLogout();
        clearCart();
        clearSavedItems(); 
        navigate('/');
    };

    return (
         <div className='navbar'>
            <div className='nav-language-toggle'>
                <label className='toggle-switch'>
                    <input 
                        type='checkbox' 
                        checked={currentLanguage === 'bg'}
                        onChange={(e) => changeLanguage(e.target.checked ? 'bg' : 'en')}
                    />
                    <span className='toggle-slider'>
                        <span className='toggle-label en-label'>EN</span>
                        <span className='toggle-label bg-label'>БГ</span>
                    </span>
                </label>
            </div>
            
            <div className='nav-logo'>
                <Link style={{textDecoration: 'none'}} to='/'>
                    <img src={logo} alt="" />
                </Link>
                    <p>Shopify</p>
            </div>
            <ul className='nav-menu'>
                <li onClick={() => setMenu('shop')}>
                    <Link style={{textDecoration: 'none'}} to='/'>{t('navigation:shop')}</Link>
                    {menu === 'shop' ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu('men')}>
                    <Link style={{textDecoration: 'none'}} to='/men'>{t('products:men')}</Link>
                    {menu === 'men' ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu('women')}>
                    <Link style={{textDecoration: 'none'}} to='/women'>{t('products:women')}</Link>
                    {menu === 'women' ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu('kids')}>
                    <Link style={{textDecoration: 'none'}} to='/kids'>{t('products:kids')}</Link>
                    {menu === 'kids' ? <hr /> : <></>}
                </li>
            </ul>
            <div className="nav-login-cart">
                <li onClick={() => setMenu('about')}>
                    <Link style={{textDecoration: 'none'}} to='/about'>{t('navigation:about')}</Link>
                    {menu === 'about' ? <hr /> : <></>}
                </li>
                
                {localStorage.getItem('auth-token')
                    ? (<button onClick={logoutHandler}>
                        {t('navigation:logout')}
                    </button>
                    )
                    : (<Link to='/login'>
                        <button>{t('navigation:login')}</button>
                    </Link>
                    )
                }
                {isAuthenticated && getTotalSavedItems() > 0 && (
                    <Link to='/saved-items' className="nav-saved-link">
                        <img src={saved_icon} alt="saved items" className="nav-saved-icon" />
                    </Link>
                )}
                {isAuthenticated && (<>
                <Link to='/cart'>
                    <img src={cart_icon} alt="" />
                </Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
                <Link to="/profile">
                    <img src={profile_icon} alt="profile" className="nav-profile-icon" />
                </Link>
                </>)}
            </div>
         </div>
    );
}