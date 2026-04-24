import { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../../context/ShopContext';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import useProductLikes  from '../../hooks/useProductLikes';

import './ProductDisplay.css';
import star_icon from '../assets/star_icon.png';
import star_dull_icon from '../assets/star_dull_icon.png';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ProductDisplay({ 
    id,
    name,
    image,
    category,
    subcategory,
    newPrice,
    oldPrice,
    available,
    officeIds,
}) {
    const { addToCart, toggleSaved, isSaved } = useContext(ShopContext);
    const { isAuthenticated } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const { t } = useTranslation(['products', 'errors', 'others']);
    const { 
        likes,
        likeProduct, 
        dislikeProduct, 
    } = useProductLikes(id, isAuthenticated);

    const [offices, setOffices] = useState([]);
    const saved = isSaved(id);

    useEffect(() => {
        // Track product view for authenticated users
        if (isAuthenticated) {
            const trackView = async () => {
                try {
                    const token = localStorage.getItem('auth-token');
                    
                    const response = await fetch(`${BASE_URL}/track-view`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': token
                        },
                        body: JSON.stringify({ productId: Number(id) })
                    });

                    if (!response.ok) {
                        console.error('Failed to track product view:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error tracking product view:', error);
                }
            };

            trackView();
        } else {
            // For non-authenticated users, use localStorage as fallback
            // const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
            // const filtered = stored.filter(p => p.id !== id);
            //
            // const updated = [
            //     { id, name, image, newPrice, oldPrice, category, subcategory, available, officeIds },
            //     ...filtered
            // ].slice(0, 8);
            //
            // localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        }
    }, [id, name, image, newPrice, oldPrice, category, subcategory, available, officeIds, isAuthenticated]);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await fetch(`${BASE_URL}/offices`);
                const data = await response.json();
                
                const officesArray = data.data || [];

                setOffices(officesArray);
            } catch (error) {
                console.error('Error fetching offices:', error);
                setOffices([]);
            }
        };

        fetchOffices();
    }, []);

    // Get the office names for the available offices
    // Convert IDs to strings for comparison since MongoDB ObjectIds might not match directly
    const availableOffices = Array.isArray(offices) && officeIds && Array.isArray(officeIds) ? offices.filter(office => {
        const officeIdStr = office._id?.toString();
        const hasMatch = officeIds.some(id => {
            const idStr = id?.toString?.() || String(id);
            return idStr === officeIdStr;
        });

        // console.log(`Office ${office.name} (${officeIdStr}): ${hasMatch}`);
        return hasMatch;
    }) : [];
    
    // console.log('Available offices:', availableOffices);

    const handleAddToCart = () => {
        if (isAuthenticated) {
            if (!available) {
                addNotification(t('products:outOfStockMsg'), 'error');
                return;
            }

            addToCart(id);
            addNotification(t('forms:cartUpdated'), 'success');
        } else {
            addToCart(id);
        }
    };

    const handleToggleSaved = async () => {
        if (!isAuthenticated) {
            addNotification('Please login to save items', 'error');
            return;
        }

        const wasSaved = saved;

        try {
            await toggleSaved(id);

            if (wasSaved) {
                addNotification('Removed from saved items', 'success');
            } else {
                addNotification('Added to saved items', 'success');
            }
        } catch (err) {
            addNotification(t('errors:unexpectedError', { defaultValue: 'Something went wrong. Try again.' }), 'error');
        }
    };

    return (
        <div className="display">
            <div className="display-left">
                <div className="display-left-top">
                    <div className="display-img-list">
                        <img src={image} alt="" />
                        <img src={image} alt="" />
                        <img src={image} alt="" />
                        <img src={image} alt="" />
                    </div>
                    <div className="display-img-container">
                        <div className="display-img">
                            <img src={image} alt="" className="display-main-img" />
                        </div>
                    </div>
                </div>

                {isAuthenticated && (
                    <div className={`display-availability ${available ? 'in-stock' : 'out-of-stock'}`}>
                        {available ? (
                            <>
                                <span className="availability-badge-icon">✓</span>
                                <div className="availability-badge-content">
                                    <p className="availability-status">{t('products:inStock')}</p>
                                    <p className="availability-details">
                                        {t('products:availableIn', { count: officeIds?.length || 0 })} {officeIds?.length !== 1 ? t('products:shops') : t('products:shop')}
                                    </p>
                                </div>
                                <div className="offices-list">
                                    <ul>
                                        {availableOffices.map((office) => (
                                            <li key={office._id}>{office.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="availability-badge-icon">✕</span>
                                <div className="availability-badge-content">
                                    <p className="availability-status out-of-stock-text">{t('products:outOfStock')}</p>
                                    <p className="availability-details">{t('products:notAvailable')}</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="display-right">
                <h1>{name}</h1>
                <div className="display-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>({likes})</p>
                </div>
                <div className="display-right-prices">
                    <div className="display-right-price-old">${oldPrice}</div>
                    <div className="display-right-price-new">${newPrice}</div>
                </div>

                <div className="display-right-description">
                    {t('others:productDescription', { name, category, subcategory, newPrice })}
                </div>
                <div className="display-right-size">
                    <h1>{t('products:selectSizeLabel')}</h1>
                    <div className="display-right-sizes">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                    </div>
                </div>
                <div className="display-right-btn-box">
                    <div className="action-buttons">
                        <button className="add-btn" onClick={handleAddToCart}>
                            {t('products:addBtn')}
                        </button>

                        <button 
                            className={`save-btn ${saved ? 'saved' : ''}`}
                            onClick={handleToggleSaved}
                        >
                            {saved ? '❤️ ' + t('products:saved') : '🤍 ' + t('products:saveBtn')}
                        </button>
                    </div>

                    <div className="display-right-likes">
                        {isAuthenticated && 
                            <div className="likes-btn-box">
                                <button className="like-btn" onClick={likeProduct}>{t('products:likeBtn')}</button>
                                <button className="dislike-btn" onClick={dislikeProduct}>{t('products:dislikeBtn')}</button>
                            </div>
                        }
                    </div>
                </div>

                <p className="likes">{t('products:totalLikes')}: <span>{likes}</span></p>
                <p className="display-right-category"><span>{t('products:category')}: </span>{category} clothing</p>
                <p className="display-right-category"><span>{t('products:tags')}: </span>{category} clothing | {subcategory}</p>
            </div>
        </div>
    );
}