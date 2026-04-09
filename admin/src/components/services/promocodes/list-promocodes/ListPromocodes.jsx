import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, multiplierToPercentage } from '../../utils';

import './ListPromocodes.css';

export default function ListPromocodes() {
    const [promocodes, setPromocodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPromocodes();
    }, []);

    const fetchPromocodes = async () => {
        try {
            const res = await fetch(`${BASE_URL}/all-promocodes`);
            const data = await res.json();

            if (!data.success) 
                throw new Error(data.message);

            setPromocodes(data.promocodes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) 
        return <div className="list-promocode"><p className="loading-message">Loading promocodes...</p></div>;

    if (error) 
        return <div className="list-promocode"><p className="error-message">{error}</p></div>;

    return (
        <div className="list-promocode">
            <h3>All Promocodes</h3>

            <div className="list-promocode-format-main">
                <p>Code</p>
                <p>Discount</p>
                <p>Expires At</p>
                <p>Actions</p>
            </div>

            <div className="list-promocode-all-items">
                {promocodes.length === 0 ? (
                    <p className="no-items-message">No promocodes found.</p>
                ) : (
                    promocodes.map(promo => (
                        <div key={promo._id} className="list-promocode-format">
                            <p>{promo.code}</p>
                            <p>{multiplierToPercentage(promo.discount)}%</p> 
                            <p>{promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'No expiry'}</p>
                            <div className="actions">
                                <Link to={`/update-promocode/${promo._id}`} className="edit-btn">Edit</Link>
                                <Link to={`/remove-promocode/${promo._id}`} className="delete-btn">Remove</Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}