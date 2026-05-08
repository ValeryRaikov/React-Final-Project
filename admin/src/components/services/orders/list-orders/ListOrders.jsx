import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import ListOrdersItem from '../list-orders-item/ListOrdersItem';
import Warning from '../../../warning/Warning';

import { errMsg, BASE_URL } from '../../utils';
import '../OrdersDisplay.css';

export default function ListOrders() {
    const { isAuthenticated } = useContext(AuthContext);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('orders');

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('auth-token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${BASE_URL}/admin/completed-orders`, {
                    method: 'GET',
                    headers: {
                        'auth-token': token,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('You do not have permission to view completed orders');
                    }

                    throw new Error(errMsg.fetchOrders || 'Failed to fetch orders');
                }

                const result = await response.json();

                setCompletedOrders(result.data || []);
            } catch (err) {
                setError(err.message || errMsg.unexpected);
                console.error('Error fetching completed orders:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            {!isAuthenticated 
                ? <Warning />
                : (<div className="list-orders">
                    <h1>{t('completedOrders')}</h1>
                    <div className="list-orders-format-main">
                        <p>{t('orderId')}</p>
                        <p>{t('customer')}</p>
                        <p>{t('itemsLabel')}</p>
                        <p>{t('totalPrice')}</p>
                        <p>{t('date')}</p>
                    </div>
                    <div className="list-orders-all-orders">
                        <hr />
                        {loading 
                            ? <p className="loading-message">{t('loading')}</p>
                            : error 
                            ? <p className="error-message">{error}</p>
                            : completedOrders.length > 0 
                            ? completedOrders.map(order => (
                                <ListOrdersItem 
                                    key={order._id} 
                                    {...order} 
                                />
                            ))
                            : <p className="no-orders-message">{t('noOrders')}</p>
                        }
                    </div>
                    <hr />
                </div>)
            }
        </>
    );
}
