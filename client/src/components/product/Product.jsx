import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from 'react-router-dom';
import { useNotification } from "../../context/NotificationContext";

import Breadcrum from "../breadcrum/Breadcrum";
import ProductDisplay from "../product-display/ProductDisplay";
import DescriptionBox from "../description-box/DescriptionBox";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Product() {
    const { productId } = useParams();
    const { addNotification } = useNotification();
    const { t } = useTranslation(['pages', 'errors']);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${BASE_URL}/product/${productId}`);

                if (!res.ok) {
                    throw new Error(t('errors:failedToLoadProduct'));
                }

                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
                addNotification(t('errors:failedToLoadProduct'), 'error');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, t]);

    // Loading state
    if (loading) {
        return <div>{t('pages:loading')}</div>;
    }

    // Safety check
    if (!product) {
        addNotification(t('errors:failedToLoadProduct'), 'error');
    }

    return (
        <div>
            <Breadcrum {...product} />
            <ProductDisplay {...product} />
            <DescriptionBox {...product} />
        </div>
    );
}