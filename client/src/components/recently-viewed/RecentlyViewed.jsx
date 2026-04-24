import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

import Item from '../item/Item';

import './RecentlyViewed.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function RecentlyViewed() {
    const [products, setProducts] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const { t } = useTranslation(['homepage']);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            if (isAuthenticated) {
                // Fetch from server for authenticated users
                try {
                    const token = localStorage.getItem('auth-token');

                    const response = await fetch(`${BASE_URL}/recently-viewed`, {
                        headers: {
                            'auth-token': token
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setProducts(data);
                    } 
                } catch (error) {
                    console.error('Error fetching recently viewed products:', error);
                    // Fallback to localStorage on error
                    // const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
                    // setProducts(stored);
                }
            } else {
                // For non-authenticated users, use localStorage
                // const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
                // setProducts(stored);
            }
        };

        fetchRecentlyViewed();
    }, [isAuthenticated]);

    if (products.length === 0) 
        return null;

    return (
        <div className="recently-viewed">
            <h1>{t('homepage:recentlyViewed')}</h1>
            <hr />
            <div className="collections">
                {products.map(item => (<Item key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
}