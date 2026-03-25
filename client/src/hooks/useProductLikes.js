import { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function useProductLikes(productId, isAuthenticated) {
    const [likes, setLikes] = useState(0);
    const [isliked, setIsLiked] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/product/${productId}`);

                if (!response.ok) {
                    setError('Failed to fetch product');
                    return;
                }

                const result = await response.json();

                // Handle both cases: likes as array or as number
                const likesCount = Array.isArray(result.likes) ? result.likes.length : result.likes;
                setLikes(likesCount);
                setError(null);
            } catch (err) {
                console.error('Error fetching likes:', err);
                setError('Failed to fetch likes');
            }
        })();
    }, [productId]);

    const likeProduct = async () => {
        if (!isAuthenticated) {
            setError('Please log in to like the product.');
            return;
        }

        const token = localStorage.getItem('auth-token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            console.error('Token is null or undefined in localStorage');
            return;
        }

        if (isliked) {
            setError('You have already liked this product.');
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
                throw new Error(errorData.error || 'Failed to like the product');
            }

            const result = await response.json();

            setLikes(result.likes);
            setIsLiked(true);
            setError(null);
        } catch (err) {
            console.error('Like error:', err);
            setError(err.message);
        }
    };

    const dislikeProduct = async () => {
        if (!isAuthenticated) {
            setError('Please log in to dislike the product.');
            return;
        }

        const token = localStorage.getItem('auth-token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            console.error('Token is null or undefined in localStorage');
            return;
        }

        if (!isliked) {
            setError('You have not liked this product yet.');
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
                throw new Error(errorData.error || 'Failed to dislike the product');
            }

            const result = await response.json();

            setLikes(result.likes);
            setIsLiked(false);
            setError(null);
        } catch (err) {
            console.error('Dislike error:', err);
            setError(err.message);
        }
    };

    return { 
        likes, 
        likeProduct, 
        dislikeProduct, 
        error,
        isliked 
    };
}