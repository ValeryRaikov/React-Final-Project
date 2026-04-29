import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ShopContext = createContext(null);

export default function ShopContextProvider(props) {
    const [allProducts, setAllProducts] = useState([]);
    const [savedItems, setSavedItems] = useState({});
    const { t } = useTranslation(['errors', 'forms']);
    const { 
        isAuthenticated, 
        showModal, 
        handleLoginClick, 
        handleGoBackClick,
        handleSessionExpired,
    } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/all-products`);

                if (!response.ok) {
                    throw new Error('Error fetching products from the server');
                }

                const result = await response.json();

                setAllProducts(result);

                if (isAuthenticated) {
                    try {
                        const getCartResponse = await fetch(`${BASE_URL}/get-cart`, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/form-data',
                                'auth-token': `${localStorage.getItem('auth-token')}`,
                                'Content-Type': 'application/json',
                            },
                            body: '',
                        });

                        if (getCartResponse.status === 401) {
                            handleSessionExpiredResponse();
                            return;
                        }

                        if (!getCartResponse.ok) {
                            throw new Error('Error fetching cart products for logged in user');
                        }

                        const getCartResult = await getCartResponse.json();

                        const formattedCart = {};

                        getCartResult.forEach(item => {
                            formattedCart[item.productId] = item.quantity;
                        });

                        setCartItems(formattedCart);
                    } catch (err) {
                        console.error(err.message);
                    }

                    try {
                        const getSavedResponse = await fetch(`${BASE_URL}/get-saved`, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/form-data',
                                'auth-token': `${localStorage.getItem('auth-token')}`,
                                'Content-Type': 'application/json',
                            },
                            body: '',
                        });

                        if (getSavedResponse.status === 401) {
                            handleSessionExpiredResponse();
                            return;
                        }

                        if (!getSavedResponse.ok) {
                            throw new Error('Error fetching saved items for logged in user');
                        }

                        const getSavedResult = await getSavedResponse.json();

                        const formattedSaved = {};

                        getSavedResult.forEach(item => {
                            formattedSaved[item.productId] = 1;
                        });

                        setSavedItems(formattedSaved);
                    } catch (err) {
                        console.error(err.message);
                    }
                } else {
                    setSavedItems({});
                }
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, [isAuthenticated]);

    useEffect(() => {
        if (allProducts.length > 0) {
            setCartItems(getDefaultCart());
        }
    }, [allProducts]);

    const clearCart = () => { 
        setCartItems({});
    };

    const clearSavedItems = () => {
        setSavedItems({});
    };

    const handleSessionExpiredResponse = () => {
        clearCart();
        clearSavedItems();
        handleSessionExpired();
    };

    const getDefaultCart = () => {
        let cart = {}
        for (let product of allProducts) {
            cart[product.id] = 0;
        }
    
        return cart;
    }

    const [cartItems, setCartItems] = useState(getDefaultCart());

    const addToCart = async (itemId) => {
        if (!isAuthenticated) {
            showModal(t('errors:loginRequiredTitle'), (
                <div>
                    <p>{t('errors:loginRequiredDesc')}</p>
                    <div className="btn-container">
                        <button onClick={() => handleGoBackClick()}>{t('forms:goBack')}</button>
                        <button onClick={() => handleLoginClick()}>{t('forms:login')}</button>
                    </div>
                </div>
            ));
            return;
        }

        // setCartItems(prev => ({...prev, [itemId]: prev[itemId] + 1}));

        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));

        if (isAuthenticated) {
            try {
                const response = await fetch(`${BASE_URL}/add-to-cart`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId }),
                });

                if (response.status === 401) {
                    handleSessionExpiredResponse();
                    return;
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${errorText}`);
                }
            } catch (err) {
                console.error(err.message);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        if (!isAuthenticated) {
            return;
        }

        // setCartItems(prev => ({...prev, [itemId]: prev[itemId] - 1}));

        setCartItems(prev => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
        }));

        if (isAuthenticated) {
            try {
                const response = await fetch(`${BASE_URL}/remove-from-cart`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId }),
                });

                if (response.status === 401) {
                    handleSessionExpiredResponse();
                    return;
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${errorText}`);
                }
            } catch (err) {
                console.error(err.message);
            }
        }
    }

    const removeEntirelyFromCart = async (itemId) => {
        if (!isAuthenticated) return;

        // Optimistic update
        setCartItems(prev => ({
            ...prev,
            [itemId]: 0
        }));

        try {
            const response = await fetch(`${BASE_URL}/remove-entirely-from-cart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            });

            if (response.status === 401) {
                handleSessionExpiredResponse();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to remove item completely');
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemData = allProducts.find(p => p.id === Number(item));
                
                if (!itemData) 
                    continue;

                totalAmount += itemData.newPrice * cartItems[item];
            }
        }

        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0)
                totalItems += cartItems[item];
        }

        return totalItems;
    }

    const toggleSaved = async (itemId) => {
        if (!isAuthenticated) {
            showModal(t('errors:loginRequiredTitle'), (
                <div>
                    <p>{t('errors:loginRequiredSaveDesc')}</p>
                    <div className="btn-container">
                        <button onClick={() => handleGoBackClick()}>{t('forms:goBack')}</button>
                        <button onClick={() => handleLoginClick()}>{t('forms:login')}</button>
                    </div>
                </div>
            ));

            return;
        }

        const isSavedItem = !!savedItems[itemId];

        // Optimistic update
        setSavedItems(prev => {
            const updated = { ...prev };

            if (updated[itemId]) {
                delete updated[itemId];
            } else {
                updated[itemId] = 1;
            }

            return updated;
        });

        // Sync with backend
        try {
            const endpoint = isSavedItem ? '/remove-from-saved' : '/add-to-saved';
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            });

            if (response.status === 401) {
                handleSessionExpiredResponse();
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${errorText}`);
            }
        } catch (err) {
            console.error(err.message);
            // Revert optimistic update on error
            setSavedItems(prev => {
                const updated = { ...prev };

                if (updated[itemId]) {
                    delete updated[itemId];
                } else {
                    updated[itemId] = 1;
                }

                return updated;
            });
        }
    };

    const isSaved = (itemId) => {
        return !!savedItems[itemId];
    };

    const getTotalSavedItems = () => {
        let totalSaved = 0;
        for (const item in savedItems) {
            if (savedItems[item])
                totalSaved += 1;
        }
        return totalSaved;
    }

    const contextValue = useMemo(() => ({
        allProducts, 
        cartItems, 
        clearCart,
        addToCart, 
        removeFromCart,
        removeEntirelyFromCart,
        getTotalCartAmount, 
        getTotalCartItems,
        savedItems,
        toggleSaved,
        isSaved,
        clearSavedItems,
        getTotalSavedItems,
    }), [allProducts, cartItems, savedItems]);

    return (
        <ShopContext.Provider value={contextValue} >
            {props.children}
        </ShopContext.Provider>
    )
}