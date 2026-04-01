import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import './Navbar.css';

import nav_logo from '../assets/nav-logo.svg';

export default function Navbar() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <img src={nav_logo} alt="" className="nav-logo" />
            <div className="nav-login">
                {isAuthenticated
                    ? (<button onClick={() => {
                        logout();
                        navigate('/admin-login');
                    }}>
                        Logout
                    </button>
                    )
                    : (<Link to='/admin-login'>
                        <button>Login</button>
                    </Link>
                    )
                }
            </div>
        </div>
    );
}