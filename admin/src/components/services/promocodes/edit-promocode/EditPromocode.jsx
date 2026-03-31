import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL, multiplierToPercentage, percentageToMultiplier } from '../../utils';

import './EditPromocode.css';

export default function EditPromocode() {
    const { promocodeId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ code: '', discount: '', expiresAt: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!promocodeId || promocodeId === 'undefined') {
            setError('Invalid promocode ID');
            setLoading(false);
            return;
        }

        fetchPromocode();
    }, [promocodeId]);

    const fetchPromocode = async () => {
        try {
            const res = await fetch(`${BASE_URL}/all-promocodes`);
            const data = await res.json();

            if (!data.success) 
                throw new Error(data.message);

            const promo = data.promocodes.find(p => p._id === promocodeId);

            if (!promo) 
                throw new Error('Promocode not found');

            setFormData({
                code: promo.code,
                discount: multiplierToPercentage(promo.discount), 
                expiresAt: promo.expiresAt?.slice(0, 10) || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const discountPercent = parseFloat(formData.discount);

            if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
                throw new Error('Discount must be between 1 and 100');
            }

            const discountMultiplier = percentageToMultiplier(discountPercent);

            const res = await fetch(`${BASE_URL}/promocode/${promocodeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: formData.code,
                    discount: discountMultiplier,
                    expiresAt: formData.expiresAt
                })
            });

            const data = await res.json();

            if (!data.success) 
                throw new Error(data.message);

            setSuccess(true);
            setTimeout(() => navigate('/list-promocodes'), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) 
        return <div className="promocode"><p>Loading...</p></div>;

    if (error) 
        return <div className="promocode"><p className="error-message">{error}</p></div>;

    return (
        <form onSubmit={handleSubmit} className="promocode">
            <h3>Edit Promocode</h3>

            <div className="promocode-itemfield">
                <p>Promo Code</p>
                <input
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                />
            </div>

            <div className="promocode-itemfield">
                <p>Discount (%)</p>
                <input
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    required
                />
            </div>

            <div className="promocode-itemfield">
                <p>Expiration Date (optional)</p>
                <input
                    name="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
            </div>

            <button type="submit" className="promocode-btn">Update</button>

            {success && <p className="success-message">Promocode updated! Redirecting...</p>}
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}