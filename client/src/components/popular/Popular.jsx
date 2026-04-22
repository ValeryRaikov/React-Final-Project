import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotification } from '../../context/NotificationContext';

import './Popular.css';

import Item from '../item/Item';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Popular() {
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation(['homepage', 'errors']);

    const { addNotification } = useNotification();

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const response = await fetch(`${BASE_URL}/popular-in-women`);

                if (!response.ok) {
                    addNotification(t('errors:errorFetchingProducts'), 'error');
                    throw new Error(t('errors:errorFetchingProducts'));
                }

                const result = await response.json();

                setPopularProducts(result);
            } catch (err) {
                addNotification(err.message, 'error');
            } finally {
                setLoading(false);
            }
        })();
    }, [t]);

    return (
        <div className="popular">
            <h1>{t('homepage:popularInWomen')}</h1>
            <hr />
            {loading ? <LoadingSpinner /> :
            (
                <div className="popular-item">
                    {popularProducts.map((item) => <Item key={item.id} {...item} />)}
                </div>
            )}
        </div>
    );
}