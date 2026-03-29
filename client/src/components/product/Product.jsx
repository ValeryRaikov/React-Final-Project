import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useNotification } from "../../context/NotificationContext";

import Breadcrum from "../breadcrum/Breadcrum";
import ProductDisplay from "../product-display/ProductDisplay";
import DescriptionBox from "../description-box/DescriptionBox";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Product() {
    const { productId } = useParams();
    const { addNotification } = useNotification();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${BASE_URL}/product/${productId}`);

                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }

                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
                addNotification('Failed to load product', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    // Loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Safety check
    if (!product) {
        // return <div>Product not found</div>;
        addNotification('Product not found', 'error');
    }

    return (
        <div>
            <Breadcrum {...product} />
            <ProductDisplay {...product} />
            <DescriptionBox {...product} />
        </div>
    );
}