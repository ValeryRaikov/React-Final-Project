import { useContext, useState, useEffect } from 'react';
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
    newPrice,
    oldPrice,
    available,
    officeIds,
}) {
    const { addToCart } = useContext(ShopContext);
    const { isAuthenticated } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const { 
        likes,
        likeProduct, 
        dislikeProduct, 
        // error,
    } = useProductLikes(id, isAuthenticated);

    const [offices, setOffices] = useState([]);

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
        console.log(`Office ${office.name} (${officeIdStr}): ${hasMatch}`);
        return hasMatch;
    }) : [];
    
    // console.log('Available offices:', availableOffices);

    const handleAddToCart = () => {
        if (!available) {
            addNotification('This product is currently out of stock', 'error');
            return;
        }

        addToCart(id);
        addNotification('Product added to cart', 'success');
    };

    return (
        <div className="display">
            <div className="display-left">
                <div className="display-img-list">
                    <img src={image} alt="" />
                    <img src={image} alt="" />
                    <img src={image} alt="" />
                    <img src={image} alt="" />
                </div>
                <div className="display-img">
                    <img src={image} alt="" className="display-main-img" />
                </div>
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
                {isAuthenticated && (
                    <div>
                        <div className={`display-availability ${available ? 'in-stock' : 'out-of-stock'}`}>
                            {available ? (
                                <>
                                    <span className="availability-badge-icon">✓</span>
                                    <div className="availability-badge-content">
                                        <p className="availability-status">In Stock</p>
                                        <p className="availability-details">Available in {officeIds?.length || 0} shop{officeIds?.length !== 1 ? 's' : ''}</p>
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
                                        <p className="availability-status out-of-stock-text">Out of Stock</p>
                                        <p className="availability-details">Not available in any shop</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className="display-right-description">
                    {`${name} is the perfect ${category} clothing for everyday. Made of fine materials and 100% cotton, our clothes are suitable for everyone. Now, don't miss the opportunity and get it for only ${newPrice}!`}
                </div>
                <div className="display-right-size">
                    <h1>Select Size</h1>
                    <div className="display-right-sizes">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                    </div>
                </div>
                <div className="display-right-btn-box">
                <button className="add-btn" onClick={() => handleAddToCart()}>Add to cart</button>
                    <div className="display-right-likes">
                        {isAuthenticated && 
                        <div className="likes-btn-box">
                            <button className="like-btn" onClick={likeProduct}>Like</button>
                            <button className="dislike-btn" onClick={dislikeProduct}>Dislike</button>
                        </div>
                        }
                    </div>
                </div>

                {/*
                {error && <p className="error-message">{error}</p>}
                */}
            
                <p className="likes">Total likes: <span>{likes}</span></p>
                <p className="display-right-category"><span>Category: </span>{category} clothing</p>
                <p className="display-right-category"><span>Tags: </span>{category} clothing</p>
            </div>
        </div>
    );
}