import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../../context/AuthContext';

import Warning from '../../../warning/Warning';
import { errMsg, BASE_URL } from '../../utils';

import '../ProductForm.css';
import upload_area from '../../../assets/upload_area.svg';

export default function AddProduct() {
    const { isAuthenticated } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [offices, setOffices] = useState([]);
    const [selectedOffices, setSelectedOffices] = useState([]);
    const [loadingOffices, setLoadingOffices] = useState(true);
    const [productDetails, setProductDetails] = useState({
        name: '',
        image: '',
        category: 'women',
        subcategory: 'shirts',
        newPrice: '',
        oldPrice: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch offices on component mount
    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const res = await fetch(`${BASE_URL}/offices`);
                const data = await res.json();
                
                if (data.success && data.data) {
                    setOffices(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch offices:', err);
            } finally {
                setLoadingOffices(false);
            }
        };

        fetchOffices();
    }, []);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleOfficeChange = (officeId) => {
        setSelectedOffices((prev) => {
            if (prev.includes(officeId)) {
                return prev.filter(id => id !== officeId);
            } else {
                return [...prev, officeId];
            }
        });
    };

    const clearForm = () => {
        setProductDetails({
            name: '',
            image: '',
            category: 'women',
            subcategory: 'shirts',
            newPrice: '',
            oldPrice: '',
        });
        setImage(null);
        setSelectedOffices([]);
    };

    const addProduct = async (e) => {
        e.preventDefault(); 

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append('product', image);

        try {
            const uploadResponse = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(errMsg.uploadImage);
            }

            const uploadResult = await uploadResponse.json();

            const product = {
                ...productDetails,
                image: uploadResult.imageUrl,
                officeIds: selectedOffices,  // Add selected office IDs
            };

            const productResponse = await fetch(`${BASE_URL}/add-product`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!productResponse.ok) {
                throw new Error(errMsg.createProduct);
            }

            const productResult = await productResponse.json();

            if (productResult.success) {
                setSuccessMessage('Product added successfully!');
                clearForm();
            } else {
                throw new Error(productResult.message || errMsg.createProduct);
            }
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
                : (<form className="product" onSubmit={addProduct}>
                    <div className="product-itemfield">
                        <p>Product name</p>
                        <input
                            value={productDetails.name}
                            onChange={changeHandler}
                            type="text"
                            name="name"
                            placeholder="Type here..."
                        />
                    </div>
                    <div className="product-price">
                        <div className="product-itemfield">
                            <p>Price</p>
                            <input
                                value={productDetails.oldPrice}
                                onChange={changeHandler}
                                type="text"
                                name="oldPrice"
                                placeholder="Type here..."
                            />
                        </div>
                        <div className="product-itemfield">
                            <p>Offer Price</p>
                            <input
                                value={productDetails.newPrice}
                                onChange={changeHandler}
                                type="text"
                                name="newPrice"
                                placeholder="Type here..."
                            />
                        </div>
                    </div>
                    <div className="product-category-row">
                        <div className="product-itemfield">
                            <p>Product Category</p>
                            <select
                                value={productDetails.category}
                                onChange={changeHandler}
                                name="category"
                                className="product-selector"
                            >
                                <option value="women">Women</option>
                                <option value="men">Men</option>
                                <option value="kids">Kids</option>
                            </select>
                        </div>
                        <div className="product-itemfield">
                            <p>Subcategory</p>
                            <select
                                value={productDetails.subcategory}
                                onChange={changeHandler}
                                name="subcategory"
                                className="product-selector"
                            >
                                <option value="shirts">Shirts</option>
                                <option value="pants">Pants</option>
                                <option value="dresses">Dresses</option>
                                <option value="tops">Tops</option>
                                <option value="jackets">Jackets</option>
                                <option value="shoes">Shoes</option>
                            </select>
                        </div>
                    </div>
                    <div className="product-itemfield">
                        <p>Available in Offices</p>
                        {loadingOffices ? (
                            <p>Loading offices...</p>
                        ) : offices.length > 0 ? (
                            <div className="offices-container">
                                {offices.map((office) => (
                                    <label 
                                        key={office._id}
                                        className={`office-checkbox-label ${!office.isOpen ? 'disabled' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedOffices.includes(office._id)}
                                            onChange={() => office.isOpen && handleOfficeChange(office._id)}
                                            disabled={!office.isOpen}
                                        />
                                        <div className="office-info">
                                            <span className="office-name">{office.name}</span>
                                            <span className={`office-status ${office.isOpen ? 'open' : 'closed'}`}>
                                                {office.isOpen ? '✓ Open' : '✗ Closed (Not Available)'}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p>No offices available</p>
                        )}
                    </div>
                    <div className="product-itemfield">
                        <label htmlFor="file-input">
                            <img
                                src={image ? URL.createObjectURL(image) : upload_area}
                                alt="Product Thumbnail"
                                className="product-thumbnail-img"
                            />
                        </label>
                        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
                    </div>
                    <button type="submit" className="product-btn" disabled={loading}>
                        {loading ? 'Adding...' : 'Add'}
                    </button>
    
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>)
            }
        </>
    );
}