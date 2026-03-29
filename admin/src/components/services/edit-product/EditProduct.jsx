import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

import Warning from '../../warning/Warning';
import { errMsg, BASE_URL } from '../utils';

import '../ProductForm.css';

export default function EditProduct() {
    const { isAuthenticated } = useContext(AuthContext);
    const { productId } = useParams(); 
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [offices, setOffices] = useState([]);
    const [selectedOffices, setSelectedOffices] = useState([]);
    const [loadingOffices, setLoadingOffices] = useState(true);
    const [product, setProduct] = useState({
        name: '',
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
                // Fetch offices
                const officesResponse = await fetch(`${BASE_URL}/offices`);
                const officesData = await officesResponse.json();
                
                if (officesData.success && officesData.data) {
                    setOffices(officesData.data);
                }

                // Fetch product
                const productResponse = await fetch(`${BASE_URL}/product/${productId}`);

                if (!productResponse.ok) {
                    throw new Error(errMsg.fetchProduct);
                }

                const result = await productResponse.json();

                setProduct(result);
                // Set selected offices from product data
                setSelectedOffices(result.officeIds || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setLoadingOffices(false);
            }
        })();
    }, [productId]);

    const submitHandler = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            if (image) {
                const formData = new FormData();
                formData.append('product', image);

                const imageUploadResponse = await fetch(`${BASE_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!imageUploadResponse.ok) {
                    throw new Error('Failed to upload image.');
                }

                const imageUploadResult = await imageUploadResponse.json();
                product.image = imageUploadResult.imageUrl;
            }

            const response = await fetch(`${BASE_URL}/update-product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...product,
                    officeIds: selectedOffices,  // Include selected offices
                }),
            });

            if (!response.ok) {
                throw new Error(errMsg.updateProduct);
            }

            setSuccessMessage('Product updated successfully!');
            navigate('/list-products');
        } catch (err) {
            setError(err.message || errMsg.unexpected);
        } finally {
            setLoading(false);
        }
    }

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = async (e) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            [e.target.name]: e.target.value,
        }));
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

    return (
        <>
            {!isAuthenticated 
                ? <Warning />
                : (<form className="product" onSubmit={submitHandler}>
                    <div className="product-itemfield">
                        <p>Product name</p>
                        <input
                            value={product.name}
                            onChange={changeHandler}
                            type="text"
                            name="name"
                        />
                    </div>
                    <div className="product-price">
                        <div className="product-itemfield">
                            <p>Price</p>
                            <input
                                value={product.oldPrice}
                                onChange={changeHandler}
                                type="text"
                                name="oldPrice"
                            />
                        </div>
                        <div className="product-itemfield">
                            <p>Offer Price</p>
                            <input
                                value={product.newPrice}
                                onChange={changeHandler}
                                type="text"
                                name="newPrice"
                            />
                        </div>
                    </div>
                    <div className="product-category-row">
                        <div className="product-itemfield">
                            <p>Product Category</p>
                            <select
                                value={product.category}
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
                                value={product.subcategory}
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
                                src={image ? URL.createObjectURL(image) : product.image}
                                alt="Product Thumbnail"
                                className="product-thumbnail-img"
                            />
                        </label>
                        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
                    </div>
                    <button 
                        onClick={submitHandler} 
                        className="product-btn" 
                        style={{backgroundColor: "#0f7e09"}}
                        disabled={loading}
                    >
                        {loading ? 'Editting...' : 'Edit'}
                    </button>
        
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>)
            }
        </>
    );
}