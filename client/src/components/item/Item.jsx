import { Link } from 'react-router-dom';

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
    const shopCount = officeIds?.length || 0;
    const shopText = shopCount === 1 ? 'shop' : 'shops';

    return (
        <div className={`item ${!available ? 'out-of-stock-item' : ''}`}>
            <div className="item-image-wrapper">
                <Link to={`/product/${id}`}><img src={image} alt="" /></Link>
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
                <div className="item-price-new">
                    ${newPrice}
                </div>
                <div className="item-price-old">
                    ${oldPrice}
                </div>
            </div>
        </div>
    );
}