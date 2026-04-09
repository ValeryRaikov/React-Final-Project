import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

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
    const { toggleSaved, isSaved } = useContext(ShopContext);
    const saved = isSaved(id);

    const shopCount = officeIds?.length || 0;
    const shopText = shopCount === 1 ? 'shop' : 'shops';

    return (
        <div className={`item ${!available ? 'out-of-stock-item' : ''}`}>
            <div className="item-image-wrapper">
                <div 
                    className={`item-save-icon ${saved ? 'saved' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleSaved(id);
                    }}
                >
                    {saved ? '❤️' : '🤍'}

                    <span className="save-tooltip">
                        {saved ? 'Saved' : 'Save for later'}
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
                            <span className="availability-text">Out of stock</span>
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