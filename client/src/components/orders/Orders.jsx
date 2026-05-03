import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './Orders.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation('order');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${BASE_URL}/my-orders`, {
                    method: 'GET',
                    headers: {
                        'auth-token': localStorage.getItem('auth-token')
                    }
                });

                const data = await res.json();

                if (data.success) {
                    setOrders(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) 
        return <p className="orders-loading">{t('loadingOrders')}</p>;

    if (!orders.length) 
        return <p className="orders-empty">{t('noOrders')}</p>;

    return (
        <div className="orders">
            <h2>{t('yourOrders')}</h2>

            {orders.map(order => (
                <div key={order._id} className="order-card">
                    <div className="order-header">
                        <span>{t('orderID')} {order._id}</span>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="order-items">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="order-item">
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <p>{item.name}</p>
                                    <p>{t('quantity')} {item.quantity}</p>
                                    <p>${item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="order-footer">
                        <span>{t('totalItems')} {order.items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                        <span>{t('totalPaid')} ${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            ))}
            <button className='go-back-btn' onClick={() => navigate(-1)}>
                {t('goBack')}
            </button>
        </div>
    );
}