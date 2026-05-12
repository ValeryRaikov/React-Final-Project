import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../../context/ShopContext';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

import './Item.css';

export default function Item({
    id,
    name,
    image,
    newPrice,
    oldPrice,
    available,
    officeIds,
}) {
    // Save functionality using ShopContext to toggle saved state and check if item is already saved
    const { toggleSaved, isSaved } = useContext(ShopContext);
    // AuthContext to check if user is authenticated before allowing them to save items
    const { isAuthenticated } = useContext(AuthContext);
    // Notification context for showing success/error messages
    const { addNotification } = useNotification();
    const { t } = useTranslation(['products', 'forms', 'errors']);
    // Check if item is saved to determine which icon to show and tooltip text
    const saved = isSaved(id);
    const shopCount = officeIds?.length || 0;
    const shopText = shopCount === 1 ? t('products:shop') : t('products:shops');

    // Handle click on save icon to toggle saved state, show notifications, and prevent click from propagating to item link
    const handleSaveClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // If user is not authenticated, show error notification and do not allow saving
        if (!isAuthenticated) {
            addNotification(t('errors:pleaseLoginToSaveItems'), 'error');
            return;
        }

        // Store current saved state to determine which notification to show after toggling
        const wasSaved = saved;

        try {
            await toggleSaved(id);

            if (wasSaved) {
                addNotification(t('forms:itemRemovedFromSaved'), 'success');
            } else {
                addNotification(t('forms:itemAddedToSaved'), 'success');
            }
        } catch (err) {
            addNotification(t('errors:somethingWentWrong'), 'error');
        }
    };

    return (
        <div className={`item ${!available ? 'out-of-stock-item' : ''}`}>
            <div className="item-image-wrapper">
                <div 
                    className={`item-save-icon ${saved ? 'saved' : ''}`}
                    onClick={handleSaveClick}
                >
                    {saved ? '❤️' : '🤍'}

                    <span className="save-tooltip">
                        {saved ? t('products:saved') : t('products:saveForLater')}
                    </span>
                </div>

                <Link to={`/product/${id}`}>
                    <img src={image} alt="" />
                </Link>

                <div className={`item-availability ${available ? 'in-stock' : 'out-of-stock'}`}>
                    {available ? (
                        <>
                            <span className="availability-icon">✓</span>
                            <span className="availability-text">{shopCount} {shopText}</span>
                        </>
                    ) : (
                        <>
                            <span className="availability-icon">✕</span>
                            <span className="availability-text">{t('products:outOfStock')}</span>
                        </>
                    )}
                </div>
            </div>

            <p>{name}</p>
            <div className="item-prices">
                <p className="item-price-new">${newPrice}</p>
                <p className="item-price-old">${oldPrice}</p>
            </div>
        </div>
    );
}