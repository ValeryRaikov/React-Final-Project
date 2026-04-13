import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import ListProductItem from '../list-product-item/ListProductItem';
import Warning from '../../../warning/Warning';

import { errMsg, BASE_URL } from '../../utils';
import '../ProductDisplay.css';

export default function ListProduct() {
    const { isAuthenticated } = useContext(AuthContext);
    const [allProducts, setAllProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation(['products', 'others']);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_URL}/all-products`);

                if (!response.ok) {
                    throw new Error(errMsg.fetchProducts);
                }

                const result = await response.json();

                setAllProducts(result);
            } catch (err) {
                setError(err.message || errMsg.unexpected);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const editClickHandler = (id) => {
        navigate(`/update-product/${id}`);
    }

    const deleteClickHandler = (id) => {
        navigate(`/remove-product/${id}`);
    }

    return (
        <>
            {!isAuthenticated 
                ? <Warning />
                : (<div className="list-product">
                    <h1>{t('products:allProducts')}</h1>
                    <div className="list-product-format-main">
                        <p>{t('products:image')}</p>
                        <p>{t('products:title')}</p>
                        <p>{t('products:price')}</p>
                        <p>{t('products:offerPrice')}</p>
                        <p>{t('products:category')}</p>
                        <p>{t('products:edit')}</p>
                        <p>{t('products:delete')}</p>
                    </div>
                    <div className="list-product-all-products">
                        <hr />
                        {loading 
                            ? <p className="loading-message">{t('others:loading')}</p>
                            : error 
                            ? <p className="error-message">{error}</p>
                            : allProducts.length > 0 
                            ? allProducts.map(product => (
                                <ListProductItem 
                                    key={product.id} 
                                    {...product} 
                                    onEdit={editClickHandler}
                                    onDelete={deleteClickHandler}
                                />
                            ))
                            : <p className="no-products-message">{t('products:noProducts')}</p>
                        }
                    </div>
                    <hr />
                </div>)
            }
        </>
    );
}