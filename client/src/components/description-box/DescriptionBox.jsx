import { useContext, useState, useEffect } from 'react';
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
                addNotification('Comment added successfully', 'success');
            }
        } catch (err) {
            console.error('Add comment error:', err);
            addNotification('Failed to add comment', 'error');
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
                addNotification('Comment deleted successfully', 'success');
            }
        } catch (err) {
            console.error(err);
            addNotification('Failed to delete comment', 'error');
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
                    Description
                </div>
                <div
                    className={`description-box-nav-box ${activeTab !== 'reviews' ? 'fade' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </div>
            </div>

            <div className="description-box-description">
                {activeTab === 'description' && (
                    !isAuthenticated
                        ? <p className="warning-message">You need to be logged in to see this.</p>
                        : (
                            <>
                                <p><span className="title">Product:</span> {name}</p>
                                <p><span className="title">Category:</span> {category}</p>
                                <p><span className="title">Subcategory:</span> {subcategory}</p>
                                <p>
                                    <span className="title">Price:</span>
                                    <span className="old-price">${oldPrice}</span>
                                    <span className="new-price">${newPrice}</span>
                                </p>
                                {available
                                    ? <p className="in-stock">In Stock</p>
                                    : <p className="out-of-stock">Out of Stock</p>
                                }
                                <p><span className="title">Year:</span> {new Date(date).getFullYear()}</p>
                            </>
                        )
                )}
                {activeTab === 'reviews' && (
                    <>
                        {!isAuthenticated && (
                            <p className="warning-message">You need to be logged in to see reviews.</p>
                        )}

                        {isAuthenticated && (
                            <>
                                <div className="comment-box">
                                    <textarea
                                        disabled={hasCommented}
                                        value={hasCommented ? 'You already commented on this product.' : commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                    />
                                    <button onClick={handleAddComment} disabled={hasCommented}>
                                        Add Comment
                                    </button>
                                </div>
                                <div className="comments-list">
                                    {localComments.length === 0 ? (
                                        <p>No comments yet.</p>
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
                                                            Delete
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