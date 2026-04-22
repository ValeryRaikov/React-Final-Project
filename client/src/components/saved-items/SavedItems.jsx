import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../../context/ShopContext';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Item from '../item/Item';

import './SavedItems.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SavedItems() {
    const { allProducts, savedItems, addToCart } = useContext(ShopContext);
    const { isAuthenticated } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const { t } = useTranslation(['pages', 'products', 'forms']);

    // Filter products that are in saved items
    const savedProducts = allProducts.filter(product => savedItems[product.id]);

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId);
            addNotification(t('forms:cartUpdated'), 'success');
        } catch (err) {
            addNotification(t('errors:unexpectedError'), 'error');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="saved-items-container">
                <div className="saved-items-empty">
                    <p>{t('pages:pleaseLogin')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-items-container">
            <div className="saved-items-header">
                <h1>{t('pages:mySavedItems')}</h1>
                <p>{savedProducts.length} {t('pages:itemsSaved', { count: savedProducts.length })}</p>
            </div>

            {savedProducts.length === 0 ? (
                <div className="saved-items-empty">
                    <p>{t('pages:noSavedItems')}</p>
                </div>
            ) : (
                <div className="saved-items-grid">
                    {savedProducts.map(product => (
                        <div key={product.id} className="saved-item-wrapper">
                            <Item {...product} />
                            <button 
                                className="saved-item-add-btn"
                                onClick={() => handleAddToCart(product.id)}
                                disabled={!product.available}
                            >
                                {product.available ? t('products:addToCart') : t('products:outOfStock')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
