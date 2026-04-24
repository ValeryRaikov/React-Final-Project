import { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useNotification } from '../../context/NotificationContext';

import './DescriptionBox.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function DescriptionBox({
    id,
    name,
    category,
    subcategory,
    newPrice,
    oldPrice,
    available,
    date,
    comments = [],
}) {
    const { isAuthenticated } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const { t } = useTranslation(['products', 'forms']);

    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [commentText, setCommentText] = useState('');
    const [localComments, setLocalComments] = useState(comments);

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            try {
                const decoded = jwtDecode(token);

                setUser({
                    id: decoded.user.id,
                    username: decoded.user.name   
                });
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, []);

    useEffect(() => {
        setLocalComments(comments);
    }, [comments]);

    // Add comment
    const handleAddComment = async () => {
        if (!commentText.trim()) 
            return;

        try {
            const response = await fetch(`${BASE_URL}/product/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({ text: commentText }),
            });

            const data = await response.json();

            if (data.success) {
                setLocalComments(data.comments);
                setCommentText('');
                addNotification(t('forms:commentAdded'), 'success');
            }
        } catch (err) {
            console.error('Add comment error:', err);
            addNotification(t('forms:failedToAddComment'), 'error');
        }
    };

    // Delete own comment
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`${BASE_URL}/product/${id}/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                },
            });

            const data = await response.json();

            if (data.success) {
                setLocalComments(data.comments);
                addNotification(t('products:commentDeleted'), 'success');
            }
        } catch (err) {
            console.error(err);
            addNotification(t('products:failedToDeleteComment'), 'error');
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const hasCommented = localComments.some(
        c => c.user?.toString() === user?.id
    );

    return (
        <div className="description-box">
            <div className="description-box-navigator">
                <div
                    className={`description-box-nav-box ${activeTab !== 'description' ? 'fade' : ''}`}
                    onClick={() => setActiveTab('description')}
                >
                    {t('products:descriptionTab')}
                </div>
                <div
                    className={`description-box-nav-box ${activeTab !== 'reviews' ? 'fade' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    {t('products:reviewsTab')}
                </div>
            </div>

            <div className="description-box-description">
                {activeTab === 'description' && (
                    !isAuthenticated
                        ? <p className="warning-message">{t('forms:loginRequired')}</p>
                        : (
                            <>
                                <p><span className="title">{t('products:product')}:</span> {name}</p>
                                <p><span className="title">{t('products:category')}:</span> {t(`products:${category}`)}</p>
                                <p><span className="title">{t('products:subcategory')}:</span> {t(`products:${subcategory}`)}</p>
                                <p>
                                    <span className="title">{t('products:price')}:</span>
                                    <span className="old-price">${oldPrice}</span>
                                    <span className="new-price">${newPrice}</span>
                                </p>
                                {available
                                    ? <p className="in-stock">{t('products:inStock')}</p>
                                    : <p className="out-of-stock">{t('products:outOfStock')}</p>
                                }
                                <p><span className="title">{t('products:year')}:</span> {new Date(date).getFullYear()}</p>
                            </>
                        )
                )}
                {activeTab === 'reviews' && (
                    <>
                        {!isAuthenticated && (
                            <p className="warning-message">{t('forms:reviewsLoginRequired')}</p>
                        )}

                        {isAuthenticated && (
                            <>
                                <div className="comment-box">
                                    <textarea
                                        disabled={hasCommented}
                                        value={hasCommented ? t('forms:alreadyCommented') : commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder={t('forms:writeComment')}
                                    />
                                    <button onClick={handleAddComment} disabled={hasCommented}>
                                        {t('forms:addComment')}
                                    </button>
                                </div>
                                <div className="comments-list">
                                    {localComments.length === 0 ? (
                                        <p>{t('forms:noComments')}</p>
                                    ) : (
                                        localComments.map((c) => (
                                            <div key={c._id} className="comment-item">
                                                <div className="comment-header">
                                                    <div className="comment-user-info">
                                                        <strong>{c.username}</strong>
                                                        <span className="comment-date">
                                                            {formatDate(c.createdAt)}
                                                        </span>
                                                    </div>
                                                    {user && c.user === user.id && (
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDeleteComment(c._id)}
                                                        >
                                                            {t('forms:deleteComment')}
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="comment-text">{c.text}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}