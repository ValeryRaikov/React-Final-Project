import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import Warning from '../../../warning/Warning';
import { errMsg, BASE_URL } from '../../utils';

import '../ProductForm.css';

export default function DeleteProduct() {
    const { isAuthenticated } = useContext(AuthContext);
    const { productId } = useParams();
    const navigate = useNavigate();
    const [offices, setOffices] = useState([]);
    const [loadingOffices, setLoadingOffices] = useState(true);
    const { t } = useTranslation(['products', 'others']);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        image: '',
        category: '',
        subcategory: '',
        newPrice: '',
        oldPrice: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_URL}/product/${productId}`);

                if (!response.ok) {
                    throw new Error(errMsg.fetchProduct);
                }

                const result = await response.json();
                setProduct(result);

                // Fetch offices
                const officesResponse = await fetch(`${BASE_URL}/offices`);
                const officesData = await officesResponse.json();
                
                if (officesData.success && officesData.data) {
                    setOffices(officesData.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setLoadingOffices(false);
            }
        })();
    }, [productId]);

    const deleteHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/remove-product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(errMsg.deleteProduct);
            }

            setSuccessMessage(t('products:productDeleted'));
            navigate('/list-products');
        } catch (err) {
            setError(err.message || errMsg.unexpected);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isAuthenticated 
                ? <Warning />
                : (<form className="product" onSubmit={deleteHandler}>
                    <div className="product-itemfield">
                        <p>{t('products:productName')}</p>
                        <input
                            value={product.name}
                            type="text"
                            name="name"
                            placeholder={t('others:typeHere')}
                            disabled
                        />
                    </div>
                    <div className="product-itemfield">
                        <p>{t('products:productDescription')}</p>
                        <textarea
                            value={product.description}
                            name="description"
                            placeholder={t('others:typeHere')}
                            rows="4"
                            disabled
                        />
                    </div>
                    <div className="product-price">
                        <div className="product-itemfield">
                            <p>{t('products:price')}</p>
                            <input
                                value={product.oldPrice}
                                type="number"
                                name="oldPrice"
                                placeholder={t('others:typeHere')}
                                disabled
                            />
                        </div>
                        <div className="product-itemfield">
                            <p>{t('products:offerPrice')}</p>
                            <input
                                value={product.newPrice}
                                type="number"
                                name="newPrice"
                                placeholder={t('others:typeHere')}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="product-category-row">
                        <div className="product-itemfield">
                            <p>{t('products:category')}</p>
                            <select
                                value={product.category}
                                name="category"
                                className="product-selector"
                                disabled
                            >
                                <option value="women">{t('products:women')}</option>
                                <option value="men">{t('products:men')}</option>
                                <option value="kids">{t('products:kids')}</option>
                            </select>
                        </div>
                        <div className="product-itemfield">
                            <p>{t('products:subcategory')}</p>
                            <select
                                value={product.subcategory}
                                name="subcategory"
                                className="product-selector"
                                disabled
                            >
                                <option value="shirts">{t('products:shirts')}</option>
                                <option value="pants">{t('products:pants')}</option>
                                <option value="dresses">{t('products:dresses')}</option>
                                <option value="tops">{t('products:tops')}</option>
                                <option value="jackets">{t('products:jackets')}</option>
                                <option value="shoes">{t('products:shoes')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="product-itemfield">
                        <p>{t('products:offices')}</p>
                        {loadingOffices ? (
                            <p>{t('others:loadingOffices')}</p>
                        ) : offices.length > 0 ? (
                            <div className="offices-container">
                                {offices.map((office) => (
                                    <label key={office._id} className="office-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={office.isOpen}
                                            readOnly
                                        />
                                        <div className="office-info">
                                            <span className="office-name">{office.name}</span>
                                            <span className={`office-status ${office.isOpen ? 'open' : 'closed'}`}>
                                                {office.isOpen ? t('others:open') : t('others:closed')}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p>{t('others:noOfficesAvailable')}</p>
                        )}
                    </div>
                    <div className="product-itemfield">
                        <label htmlFor="file-input">
                            <img
                                src={product.image}
                                alt="Product Thumbnail"
                                className="product-thumbnail-img"
                            />
                        </label>
                        <input type="file" name="image" id="file-input" hidden disabled />
                    </div>
                    <button 
                        onClick={deleteHandler} 
                        className="product-btn" 
                        style={{backgroundColor: "#ff0000"}}
                        disabled={loading}
                    >
                        {loading ? t('others:removing') : t('products:delete')}
                    </button>
        
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>)
            }
        </>
    );
}
