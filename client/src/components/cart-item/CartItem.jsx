import { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import { ShopContext } from '../../context/ShopContext';
import './CartItem.css';
import remove_icon from '../assets/cart_cross_icon.png';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CartItem() {
    const { 
        allProducts, 
        cartItems, 
        removeFromCart,
        removeEntirelyFromCart, 
        addToCart, 
        getTotalCartAmount 
    } = useContext(ShopContext);

    const { t } = useTranslation(['cart', 'errors', 'forms']);
    const { addNotification } = useNotification();

    const [promocode, setPromocode] = useState('');
    const [discount, setDiscount] = useState(1);
    const [totalPrice, setTotalPrice] = useState(getTotalCartAmount());

    useEffect(() => {
        setTotalPrice(getTotalCartAmount() * discount);
    }, [discount, getTotalCartAmount]);

    const handlePromocodeChange = (e) => {
        setPromocode(e.target.value);
    };

    const handlePromocodeSubmit = async () => {
        try {
            const res = await fetch(`${BASE_URL}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: promocode,
                    subtotal: getTotalCartAmount()
                })
            });

            const data = await res.json();

            if (data.valid) {
                setDiscount(data.discount);
                setTotalPrice(data.total);
                addNotification(t('forms:promoCodeApplied'), 'success');
            } else {
                setDiscount(1);
                setPromocode('');
                addNotification(data.message || t('errors:invalidPromoCode'), 'error');
            }

        } catch (error) {
            console.error(error);
            setPromocode('');
            setDiscount(1);
            addNotification(t('errors:serverError'), 'error');
        }
    };

    return (
        <div className="cart-items">
            <div className="cart-items-format-main">
                <p>{t('cart:product')}</p>
                <p>{t('cart:title')}</p>
                <p>{t('cart:price')}</p>
                <p>{t('cart:quantity')}</p>
                <p>{t('cart:total')}</p>
                <p>{t('cart:remove')}</p>
            </div>
            <hr />

            {allProducts.map(item => {
                const quantity = cartItems[item.id];
                if (quantity > 0) {
                    return (
                        <div key={item.id}>
                            <div className="cart-items-format cart-items-format-main">
                                <img src={item.image} alt={item.name} className="cart-items-product-icon" />
                                <p>{item.name}</p>
                                <p>${item.newPrice}</p>
                                <div className="cart-items-quantity-control">
                                <button 
                                    className="qty-btn"
                                    onClick={() => removeFromCart(item.id)}
                                    disabled={quantity === 1}
                                >
                                    -
                                </button>

                                <span className="qty-value">{quantity}</span>

                                <button 
                                    className="qty-btn"
                                    onClick={() => addToCart(item.id)}
                                >
                                    +
                                </button>
                            </div>
                                <p>${item.newPrice * quantity}</p>
                                <img
                                    src={remove_icon}
                                    alt=""
                                    className="cart-items-remove-icon"
                                    onClick={() => removeEntirelyFromCart(item.id)}
                                />
                            </div>
                            <hr />
                        </div>
                    );
                }

                return null;
            })}

            <div className="cart-items-down">
                <div className="cart-items-total">
                    <h1>{t('cart:cart')} {t('cart:total')}:</h1>
                    <div>
                        <div className="cart-items-total-item">
                            <p>{t('cart:subtotal')}</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-items-total-item">
                            <p>{t('cart:shipping')}</p>
                            <p>{t('cart:free')}</p>
                        </div>
                        <hr />
                        <div className="cart-items-total-item">
                            <h3>{t('cart:total')}</h3>
                            <h3>${totalPrice.toFixed(2)}</h3>
                        </div>
                    </div>

                    <button>{t('cart:checkout')}</button>
                </div>

                <div className="cart-items-promocode">
                    <p>{t('forms:promoCodePromt')}</p>
                    <div className="cart-items-promobox">
                        <input
                            value={promocode}
                            onChange={handlePromocodeChange}
                            type="text"
                            name="promocode"
                            placeholder={t('cart:promoCode')}
                        />
                        <button onClick={handlePromocodeSubmit}>{t('forms:submit')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}