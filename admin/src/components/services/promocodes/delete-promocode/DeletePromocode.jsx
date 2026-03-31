import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils';

import './DeletePromocode.css';

export default function DeletePromocode() {
    const { promocodeId } = useParams();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`${BASE_URL}/promocode/${promocodeId}`, {
                method: 'DELETE'
            });

            if (!res.ok) 
                throw new Error('Delete failed');

            navigate('/list-promocodes');
        } catch (err) {
            setError(err.message);
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        navigate('/list-promocodes');
    };

    if (deleting) 
        return <div className="delete-promocode"><p>Deleting promocode...</p></div>;

    return (
        <div className="delete-promocode">
            <h3>Delete Promocode</h3>
            <p>Are you sure you want to delete this promocode?</p>
            <p>This action cannot be undone.</p>
            {error && <p className="error-message">{error}</p>}
            <div>
                <button onClick={handleDelete} className="delete-confirm-btn">Delete</button>
                <button onClick={handleCancel} className="delete-cancel-btn">Cancel</button>
            </div>
        </div>
    );
}