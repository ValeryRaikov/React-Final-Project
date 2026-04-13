import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils';
import { useTranslation } from 'react-i18next';

import './DeletePromocode.css';

export default function DeletePromocode() {
    const { promocodeId } = useParams();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation('promocodes');

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
        return <div className="delete-promocode"><p>{t('promocodeDeleteLoading')}</p></div>;

    return (
        <div className="delete-promocode">
            <h3>{t('promocodeDelete')}</h3>
            <p>{t('promocodeDeleteConfirm')}</p>
            <p>{t('promocodeDeleteWarning')}</p>
            {error && <p className="error-message">{error}</p>}
            <div>
                <button onClick={handleDelete} className="delete-confirm-btn">{t('delete')}</button>
                <button onClick={handleCancel} className="delete-cancel-btn">{t('cancel')}</button>
            </div>
        </div>
    );
}