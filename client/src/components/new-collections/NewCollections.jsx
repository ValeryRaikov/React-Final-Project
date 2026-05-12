import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotification } from '../../context/NotificationContext';

import './NewCollections.css';

import Item from '../item/Item';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function NewCollections() {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation(['homepage', 'errors']);
    // Notification context to display error messages if fetching new products fails
    const { addNotification } = useNotification();

    // Fetch new products from the backend when the component mounts, and handle loading state and errors
    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const response = await fetch(`${BASE_URL}/new-collection`);

                if (!response.ok) {
                    addNotification(t('errors:errorFetchingProducts'), 'error');
                    throw new Error(t('errors:errorFetchingProducts'));
                }

                const result = await response.json();

                setNewProducts(result);
            } catch (err) {
                addNotification(t('errors:somethingWentWrong'), 'error');
            } finally {
                setLoading(false);
            }
        })();
    }, [t]);

    return (
        <div className="new-collections">
            <h1>{t('homepage:newCollections')}</h1>
            <hr />
            {loading ? <LoadingSpinner /> :
            (
                <div className="collections">
                    {newProducts.map((item) => <Item key={item.id} {...item} />)}
                </div>
            )}
        </div>
    );
}