import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, percentageToMultiplier } from '../../utils';

import './AddPromocode.css';

export default function AddPromocode() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        expiresAt: ''
    });

    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const discountPercent = parseFloat(formData.discount);

            if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
                throw new Error('Discount must be between 1 and 100');
            }

            const discountMultiplier = percentageToMultiplier(discountPercent);

            const res = await fetch(`${BASE_URL}/add-promocode`, {
                method: 'POST',
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

            setMessage('Promocode created successfully!');
            setIsSuccess(true);
            setFormData({ code: '', discount: '', expiresAt: '' });
            setTimeout(() => navigate('/list-promocodes'), 1500);
        } catch (err) {
            setMessage(err.message);
            setIsSuccess(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="promocode">
            <h3>Add Promocode</h3>

            <div className="promocode-itemfield">
                <p>Promo Code</p>
                <input
                    name="code"
                    value={formData.code}
                    onChange={changeHandler}
                    placeholder="e.g., SUMMER25"
                    required
                />
            </div>

            <div className="promocode-itemfield">
                <p>Discount (%)</p>
                <input
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={changeHandler}
                    placeholder="e.g., 20"
                    min="1"
                    max="100"
                    required
                />
            </div>

            <div className="promocode-itemfield">
                <p>Expiration Date (optional)</p>
                <input
                    name="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={changeHandler}
                />
            </div>

            <button type="submit" className="promocode-btn">Create</button>

            {message && (
                <p className={isSuccess ? 'success-message' : 'error-message'}>
                    {message}
                </p>
            )}
        </form>
    );
}