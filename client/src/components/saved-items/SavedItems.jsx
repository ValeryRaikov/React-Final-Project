import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { AuthContext } from '../../context/AuthContext';
import Item from '../item/Item';

import './SavedItems.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SavedItems() {
    const { allProducts, savedItems, addToCart } = useContext(ShopContext);
    const { isAuthenticated } = useContext(AuthContext);

    // Filter products that are in saved items
    const savedProducts = allProducts.filter(product => savedItems[product.id]);

    const handleAddToCart = (productId) => {
        addToCart(productId);
    };

    if (!isAuthenticated) {
        return (
            <div className="saved-items-container">
                <div className="saved-items-empty">
                    <p>Please login to view your saved items.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-items-container">
            <div className="saved-items-header">
                <h1>My Saved Items</h1>
                <p>{savedProducts.length} item{savedProducts.length !== 1 ? 's' : ''} saved</p>
            </div>

            {savedProducts.length === 0 ? (
                <div className="saved-items-empty">
                    <p>You haven't saved any items yet.</p>
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
                                {product.available ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
