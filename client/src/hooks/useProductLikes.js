import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function useProductLikes(productId, isAuthenticated) {
    const { addNotification } = useNotification();
    const { t } = useTranslation(['errors', 'products']);

    const [likes, setLikes] = useState(0);
    const [isliked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!productId) return;

        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/product/${productId}`);

                if (!response.ok) {
                    addNotification(t('errors:fetchFail'), 'error');
                    return;
                }

                const result = await response.json();

                const likesArray = result.likes || [];
                setLikes(likesArray.length);

                const token = localStorage.getItem('auth-token');

                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        const userId = decoded.user.id;

                        const hasLiked = likesArray.some(
                            (id) => id.toString() === userId
                        );

                        setIsLiked(hasLiked);
                    } catch (err) {
                        console.error(t('errors:tokenDecodeError'), err);
                    }
                }
            } catch (err) {
                console.error(t('errors:loadLikesFail'), err);
                addNotification(t('errors:loadLikesFail'), 'error');
            }
        })();
    }, [productId]);

    const likeProduct = async () => {
        if (!isAuthenticated) {
            addNotification(t('errors:loginToLikeProducts'), 'warning');
            return;
        }

        const token = localStorage.getItem('auth-token');

        if (!token) {
            console.error(t('errors:nullTokenError'));
            addNotification(t('errors:sessionExpiredError'), 'error');
            return;
        }

        if (isliked) {
            addNotification(t('errors:alreadyLikedProduct'), 'warning');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/product/${productId}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                addNotification(
                    errorData.error || t('errors:likeProductFail'),
                    'error'
                );
                return;
            }

            const result = await response.json();

            setLikes(result.likes);
            setIsLiked(true);
            addNotification(t('products:productLikedSuccess'), 'success');
        } catch (err) {
            console.error(t('errors:likeProductFail'), err);
            addNotification(t('errors:likeProductFail'), 'error');
        }
    };

    const dislikeProduct = async () => {
        if (!isAuthenticated) {
            addNotification(t('errors:loginToDislikeProduct'), 'warning');
            return;
        }

        const token = localStorage.getItem('auth-token');

        if (!token) {
            console.error(t('errors:nullTokenError'));
            addNotification(t('errors:authTokenNotFound'), 'warning');
            return;
        }

        if (!isliked) {
            addNotification(t('products:notLikedProductYet'), 'warning');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/product/${productId}/dislike`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                addNotification(
                    errorData.error || t('errors:dislikeProductFail'),
                    'error'
                );
                return;
            }

            const result = await response.json();

            setLikes(result.likes);
            setIsLiked(false);
            addNotification(t('products:productDislikedSuccess'), 'success');
        } catch (err) {
            console.error(t('errors:dislikeProductFail'), err);
            addNotification(t('errors:dislikeProductFail'), 'error');
        }
    };

    return { 
        likes, 
        likeProduct, 
        dislikeProduct, 
        isliked 
    };
}