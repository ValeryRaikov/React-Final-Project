import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

import './Navbar.css';

import nav_logo from '../assets/nav-logo.svg';

export default function Navbar() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const { t } = useTranslation('auth');
    const { currentLanguage, changeLanguage } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <img src={nav_logo} alt="" className="nav-logo" />
            <div className="nav-login">
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

                {isAuthenticated
                    ? (<button onClick={() => {
                        logout();
                        navigate('/admin-login');
                    }}>
                        {t('logout')}
                    </button>
                    )
                    : (<Link to='/admin-login'>
                        <button>{t('login')}</button>
                    </Link>
                    )
                }
            </div>
        </div>
    );
}