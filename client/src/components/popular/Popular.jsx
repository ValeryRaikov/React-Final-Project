import { useEffect, useState } from 'react';

import { useNotification } from '../../context/NotificationContext';

import './Popular.css';

import Item from '../item/Item';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Popular() {
    const [popularProducts, setPopularProducts] = useState([]);
    // const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { addNotification } = useNotification();

    useEffect(() => {
        (async () => {
            setLoading(true);
            // setError(null);

            try {
                const response = await fetch(`${BASE_URL}/popular-in-women`);

                if (!response.ok) {
                    addNotification('Error fetching products from the server', 'error');
                    throw new Error('Error fetching products from the server!');
                }

                const result = await response.json();

                setPopularProducts(result);
            } catch (err) {
                // setError(err.message);
                addNotification(err.message, 'error');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="popular">
            <h1>Popular In Women</h1>
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