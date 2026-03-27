import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function useProductLikes(productId, isAuthenticated) {
    const { addNotification } = useNotification();

    const [likes, setLikes] = useState(0);
    const [isliked, setIsLiked] = useState(false);
    // const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/product/${productId}`);

                if (!response.ok) {
                    // setError('Failed to fetch product');
                    addNotification('Failed to fetch product', 'error');
                    return;
                }

                const result = await response.json();

                const likesCount = result.likes.length;
                setLikes(likesCount);
                // setError(null);
            } catch (err) {
                console.error('Error fetching likes:', err);
                // setError('Failed to fetch likes');
                addNotification('Failed to load likes', 'error');
            }
        })();
    }, [productId]);

    const likeProduct = async () => {
        if (!isAuthenticated) {
            // setError('Please log in to like the product.');
            addNotification('Please log in to like the product', 'warning');
            return;
        }

        const token = localStorage.getItem('auth-token');

        if (!token) {
            console.error('Token is null or undefined in localStorage');
            // setError('Authentication token not found. Please log in again.');
            addNotification('Session expired. Please log in again', 'error');
            return;
        }

        if (isliked) {
            // setError('You have already liked this product.');
            addNotification('You already liked this product', 'warning');
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
                addNotification(errorData.error || 'Failed to like the product', 'error');
                throw new Error(errorData.error || 'Failed to like the product');
            }

            const result = await response.json();

            setLikes(result.likes);
            setIsLiked(true);
            // setError(null);
            addNotification('Product liked successfully', 'success');
        } catch (err) {
            console.error('Like error:', err);
            // setError(err.message);
            addNotification('Failed to like the product', 'error');
        }
    };

    const dislikeProduct = async () => {
        if (!isAuthenticated) {
            // setError('Please log in to dislike the product.');
            addNotification('Please log in to dislike the product', 'warning');
            return;
        }

        const token = localStorage.getItem('auth-token');

        if (!token) {
            console.error('Token is null or undefined in localStorage');
            // setError('Authentication token not found. Please log in again.');
            addNotification('Authentication token not found. Please log in again.', 'warning');
            return;
        }

        if (!isliked) {
            // setError('You have not liked this product yet.');
            addNotification('You have not liked this product yet', 'warning');
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
                addNotification(errorData.error || 'Failed to dislike the product', 'error');
                throw new Error(errorData.error || 'Failed to dislike the product');
            }

            const result = await response.json();

            setLikes(result.likes);
            setIsLiked(false);
            // setError(null);
            addNotification('Like removed', 'success');
        } catch (err) {
            console.error('Dislike error:', err);
            // setError(err.message);
            addNotification('Failed to remove like', 'error');
        }
    };

    return { 
        likes, 
        likeProduct, 
        dislikeProduct, 
        // error,
        isliked 
    };
}