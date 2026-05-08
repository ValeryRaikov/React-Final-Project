import '../OrdersDisplay.css';
import { useTranslation } from 'react-i18next';

export default function ListOrdersItem({
    _id,
    userId,
    items,
    totalPrice,
    createdAt,
}) {
    const { t } = useTranslation('orders');

    const orderId = _id.toString().slice(-8).toUpperCase();
    const customerName = userId?.name || t('unknownCustomer');
    const itemCount = items?.length || 0;
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="list-orders-format-main list-orders-format">
            <p className="order-id">{orderId}</p>
            <p className="customer-name">{customerName}</p>
            <p className="items-count">{itemCount} {itemCount === 1 ? t('item') : t('items')}</p>
            <p className="total-price">${totalPrice.toFixed(2)}</p>
            <p className="order-date">{formattedDate}</p>
        </div>
    );
}
