import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './ProductsAbout.css';
import product_1 from '../assets/product_1.png';
import product_4 from '../assets/product_4.png';
import product_5 from '../assets/product_5.png';
import product_14 from '../assets/product_14.png';
import product_24 from '../assets/product_24.png';
import product_28 from '../assets/product_28.png';
import product_30 from '../assets/product_30.png';

export default function ProductsAbout() {
    const { t } = useTranslation(['about', 'others', 'products']);

    return (
        <div className="products-about">
            <h2>{t('about:ourProducts')}</h2>
            <p>{t('about:productsAboutDesc')}</p>
            <h2>{t('about:bestsellers')}</h2>
            <div className="products-about-gallery">
                <img src={product_1} alt="" />
                <div className="gallery-right">
                    <div className="up">
                        <img src={product_14} alt="" />
                        <img src={product_4} alt="" />
                        <img src={product_30} alt="" />
                    </div>
                    <div className="down">
                        <img src={product_28} alt="" />
                        <img src={product_24} alt="" />
                        <img src={product_5} alt="" />
                    </div>
                </div>
            </div>
            <div className="products-about-shop">
                <h2>{t('others:shopNow')}</h2>
                <div className="shop-links">
                    <ul>
                        <li><Link to='/men'>{t('products:men')}</Link></li>
                        <li><Link to='/women'>{t('products:women')}</Link></li>
                        <li><Link to='/kids'>{t('products:kids')}</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}