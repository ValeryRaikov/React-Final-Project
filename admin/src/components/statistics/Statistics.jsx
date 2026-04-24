import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Statistics.css';

const API_URL = import.meta.env.VITE_BASE_URL;

export default function Statistics() {
    const { t } = useTranslation(['statistics', 'products']);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('auth-token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${API_URL}/admin-statistics`, {
                    headers: {
                        'auth-token': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const data = await response.json();
                setStats(data.statistics);
                setError(null);
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [t]);

    if (loading) {
        return (
            <div className="statistics">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>{t('statistics:loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="statistics">
                <div className="error-message">
                    <p>❌ {t('statistics:errorPrefix')}: {error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="statistics">
            <div className="stats-header">
                <h1>📊 {t('statistics:dashboardTitle')}</h1>
                <p>{t('statistics:dashboardSubtitle')}</p>
            </div>

            <div className="stats-grid key-metrics">
                <div className="stat-card primary">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>{t('statistics:totalCustomers')}</h3>
                        <p className="stat-value">{stats.totalCustomers}</p>
                    </div>
                </div>

                <div className="stat-card secondary">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <h3>{t('statistics:totalProducts')}</h3>
                        <p className="stat-value">{stats.totalProducts}</p>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{t('statistics:availableProducts')}</h3>
                        <p className="stat-value">{stats.availableProducts}</p>
                    </div>
                </div>

                <div className="stat-card danger">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                        <h3>{t('statistics:unavailableProducts')}</h3>
                        <p className="stat-value">{stats.unavailableProducts}</p>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h2>📂 {t('statistics:productsByCategory')}</h2>

                <div className="table-responsive">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>{t('statistics:category')}</th>
                                <th>{t('statistics:total')}</th>
                                <th>{t('statistics:available')}</th>
                                <th>{t('statistics:unavailable')}</th>
                                <th>{t('statistics:percentage')}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stats.productsByCategory.map((cat) => {
                                const percentage = cat.count
                                    ? ((cat.available / cat.count) * 100).toFixed(0)
                                    : 0;

                                return (
                                    <tr key={cat._id}>
                                        <td className="category-name">
                                            {t(`products:${cat._id}`) || t('statistics:notAvailableShort')}
                                        </td>
                                        <td className="count">{cat.count}</td>
                                        <td className="available">{cat.available}</td>
                                        <td className="unavailable">
                                            {cat.count - cat.available}
                                        </td>
                                        <td>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${percentage}%`
                                                    }}
                                                ></div>
                                            </div>
                                            {percentage}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="stats-section">
                <h2>❤️ {t('statistics:mostLikedProducts')}</h2>

                <div className="products-grid">
                    {stats.mostLikedProducts?.length > 0 ? (
                        stats.mostLikedProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    <div className="product-badge">
                                        {product.likes} ❤️
                                    </div>
                                </div>

                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <p className="product-category">
                                        {t(`products:${product.category}`)}
                                    </p>
                                    <p className="product-price">
                                        ${product.price}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">{t('statistics:noLikedProducts')}</p>
                    )}
                </div>
            </div>

            <div className="stats-section">
                <h2>💬 {t('statistics:mostCommentedProducts')}</h2>

                <div className="products-grid">
                    {stats.mostCommentedProducts?.length > 0 ? (
                        stats.mostCommentedProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    <div className="product-badge">
                                        {product.comments} 💬
                                    </div>
                                </div>

                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <p className="product-category">
                                        {t(`products:${product.category}`)}
                                    </p>
                                    <p className="product-price">
                                        ${product.price}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">{t('statistics:noCommentedProducts')}</p>
                    )}
                </div>
            </div>

            <div className="stats-section">
                <h2>🏷️ {t('statistics:topSubcategories')}</h2>

                <div className="subcategory-list">
                    {stats.productsBySubcategory?.length > 0 ? (
                        stats.productsBySubcategory.map((subcat, idx) => (
                            <div key={subcat._id} className="subcat-item">
                                <div className="subcat-rank">#{idx + 1}</div>

                                <div className="subcat-info">
                                    <p className="subcat-name">
                                        {t(`products:${subcat._id}`) || t('statistics:notAvailableShort')}
                                    </p>
                                    <p className="subcat-category">
                                        {t(`products:${subcat.category}`)}
                                    </p>
                                </div>

                                <div className="subcat-count">
                                    <span className="count-badge">
                                        {subcat.count}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">{t('statistics:noSubcategories')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}