// context/ShopContext.jsx - Provides shopping-related state and functions to the app using React Context API

import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create a context for shop management 
export const ShopContext = createContext(null);

// ShopContextProvider component to wrap the app and provide shopping-related state and functions
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

    // Load all products and user-specific cart/saved items on component mount and when authentication status changes
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

    // When allProducts are loaded, initialize cartItems state with product IDs and 0 quantity
    useEffect(() => {
        if (allProducts.length > 0) {
            setCartItems(getDefaultCart());
        }
    }, [allProducts]);

    // Function to clear cart items (used on session expiration)
    const clearCart = () => { 
        setCartItems({});
    };

    // Function to clear saved items (used on session expiration)
    const clearSavedItems = () => {
        setSavedItems({});
    };

    // Handle session expiration by clearing cart/saved items and invoking the session expired handler from AuthContext
    const handleSessionExpiredResponse = () => {
        clearCart();
        clearSavedItems();
        handleSessionExpired();
    };

    // Function to get default cart object with all product IDs set to 0 quantity
    const getDefaultCart = () => {
        let cart = {}
        for (let product of allProducts) {
            cart[product.id] = 0;
        }
    
        return cart;
    }

    // State to manage cart items, initialized with default cart structure
    const [cartItems, setCartItems] = useState(getDefaultCart());

    // Function to add an item to the cart, with authentication check and optimistic UI update
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

        // Optimistic UI update - immediately update cart state before confirming with backend [OLD]
        // setCartItems(prev => ({...prev, [itemId]: prev[itemId] + 1}));

        // Optimistic UI update - immediately update cart state before confirming with backend
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

    // Function to remove one quantity of an item from the cart, with authentication check and optimistic UI update
    const removeFromCart = async (itemId) => {
        if (!isAuthenticated) {
            return;
        }

        // Optimistic UI update - immediately update cart state before confirming with backend [OLD]
        // setCartItems(prev => ({...prev, [itemId]: prev[itemId] - 1}));

        // Optimistic UI update - immediately update cart state before confirming with backend
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

    // Function to remove an item entirely from the cart, with authentication check and optimistic UI update
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

    // Function to calculate total cart amount by summing the price of each item multiplied by its quantity
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

    // Function to calculate total number of items in the cart by summing the quantities of all items
    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0)
                totalItems += cartItems[item];
        }

        return totalItems;
    }

    // Function to toggle an item in the saved items list, with authentication check and optimistic UI update
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

        // Check if the item is currently saved to determine whether to add or remove it from the saved items list
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

    // Function to check if an item is in the saved items list
    const isSaved = (itemId) => {
        return !!savedItems[itemId];
    };

    // Function to calculate total number of saved items by counting the keys in the savedItems object
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

    // Provide the shopping-related state and functions to the app through the ShopContext.Provider
    return (
        <ShopContext.Provider value={contextValue} >
            {props.children}
        </ShopContext.Provider>
    )
}