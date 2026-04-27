import { useContext, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../../context/ShopContext';
import { filterProducts } from '../../utils/filters.js';
import { sortProducts } from '../../utils/sortings.js';

import './Category.css';

import Item from '../item/Item';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const DEFAULT_FILTERS = {
    sortOption: 'id-asc',
    searchQuery: '',
    stockFilter: 'all',
    subcategoryFilter: 'all',
    officeFilter: 'all',
    maxPrice: '',
    minPrice: '',
};

export default function Category({ banner, category }) {
    const { allProducts } = useContext(ShopContext);
    const { t } = useTranslation(['pages', 'products']);

    const [offices, setOffices] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Filters state
    const [sortOption, setSortOption] = useState(DEFAULT_FILTERS.sortOption);
    const [searchQuery, setSearchQuery] = useState(DEFAULT_FILTERS.searchQuery);
    const [stockFilter, setStockFilter] = useState(DEFAULT_FILTERS.stockFilter);
    const [subcategoryFilter, setSubcategoryFilter] = useState(DEFAULT_FILTERS.subcategoryFilter);
    const [officeFilter, setOfficeFilter] = useState(DEFAULT_FILTERS.officeFilter);
    const [maxPrice, setMaxPrice] = useState(DEFAULT_FILTERS.maxPrice);
    const [minPrice, setMinPrice] = useState(DEFAULT_FILTERS.minPrice);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // FILTER + SORT
    const sortedProducts = useMemo(() => {
        if (!allProducts.length) return [];

        const filtered = filterProducts(allProducts, {
            category,
            searchQuery,
            stockFilter,
            subcategoryFilter,
            maxPrice,
            minPrice,
            officeFilter
        });

        return sortProducts(filtered, sortOption);
    }, [
        allProducts,
        category,
        searchQuery,
        stockFilter,
        subcategoryFilter,
        officeFilter,
        maxPrice,
        minPrice,
        sortOption
    ]);

    // Fetch offices
    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const res = await fetch(`${BASE_URL}/offices`);
                const data = await res.json();
                setOffices(data.data || []);
            } catch (err) {
                console.error('Failed to fetch offices:', err);
            }
        };

        fetchOffices();
    }, []);

    // Clear filters
    const clearFilters = () => {
        setSortOption(DEFAULT_FILTERS.sortOption);
        setSearchQuery(DEFAULT_FILTERS.searchQuery);
        setStockFilter(DEFAULT_FILTERS.stockFilter);
        setSubcategoryFilter(DEFAULT_FILTERS.subcategoryFilter);
        setOfficeFilter(DEFAULT_FILTERS.officeFilter);
        setMaxPrice(DEFAULT_FILTERS.maxPrice);
        setMinPrice(DEFAULT_FILTERS.minPrice);
    };

    // Check if filters are default
    const isDefaultState =
        sortOption === DEFAULT_FILTERS.sortOption &&
        searchQuery === DEFAULT_FILTERS.searchQuery &&
        stockFilter === DEFAULT_FILTERS.stockFilter &&
        subcategoryFilter === DEFAULT_FILTERS.subcategoryFilter &&
        officeFilter === DEFAULT_FILTERS.officeFilter &&
        maxPrice === DEFAULT_FILTERS.maxPrice &&
        minPrice === DEFAULT_FILTERS.minPrice;

    return (
        <div className="category">
            <img className="category-banner" src={banner} alt="" />
            <div className="category-indexSort">
                <div className="filters-dropdown">
                    <button 
                        className="filter-toggle" 
                        onClick={() => setShowFilters(prev => !prev)}
                    >
                        {t('pages:filters')}
                    </button>
                    {showFilters && (
                        <div className="filters-menu">
                            <div className="filter-group">
                                <label>{t('pages:filterStock')}</label>
                                <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
                                    <option value="all">{t('pages:filterAll')}</option>
                                    <option value="in">{t('pages:stockIn')}</option>
                                    <option value="out">{t('pages:stockOut')}</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>{t('pages:filterType')}</label>
                                <select value={subcategoryFilter} onChange={e => setSubcategoryFilter(e.target.value)}>
                                    <option value="all">{t('pages:filterAll')}</option>
                                    <option value="shirts">{t('pages:typeShirts')}</option>
                                    <option value="tops">{t('pages:typeTops')}</option>
                                    <option value="dresses">{t('pages:typeDresses')}</option>
                                    <option value="jackets">{t('pages:typeJackets')}</option>
                                    <option value="shoes">{t('pages:typeShoes')}</option>
                                    <option value="pants">{t('pages:typePants')}</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>{t('pages:filterOffice')}</label>
                                <select value={officeFilter} onChange={e => setOfficeFilter(e.target.value)}>
                                    <option value="all">{t('pages:filterAll')}</option>
                                    {offices.map(o => (
                                        <option key={o._id} value={o._id}>
                                            {o.name} {!o.isOpen ? ` ${t('pages:officeClosedLabel')}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>{t('pages:filterMaxPrice')}</label>
                                <input
                                    type="number"
                                    placeholder="999"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                />
                            </div>
                            <div className="filter-group">
                                <label>{t('pages:filterMinPrice')}</label>
                                <input
                                    type="number"
                                    placeholder="1"
                                    value={minPrice}
                                    onChange={e => setMinPrice(e.target.value)}
                                />
                            </div>
                            <div className="filter-actions">
                                <button 
                                    className="clear-filters-btn"
                                    onClick={clearFilters}
                                    disabled={isDefaultState}
                                >
                                    {t('pages:clearFilters')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="search-bar">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder={t('pages:searchProducts')}
                    />
                </div>
                <div className="category-sort">
                    <label>{t('pages:sortBy')}</label>
                    <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                        <option value="id-asc">{t('pages:sortOldest')}</option>
                        <option value="id-desc">{t('pages:sortNewest')}</option>
                        <option value="newPrice-asc">{t('pages:sortCheapest')}</option>
                        <option value="newPrice-desc">{t('pages:sortMostExpensive')}</option>
                        <option value="likes-desc">{t('pages:sortMostLiked')}</option>
                        <option value="comments-desc">{t('pages:sortMostCommented')}</option>
                    </select>
                </div>
            </div>
            {!allProducts.length ? (
                <div className="loading-spinner"><LoadingSpinner /></div>
            ) : !sortedProducts.length ? (
                <p className="error-message">{t('pages:noProductsFound')}</p>
            ) : (
                <div className="category-products">
                    {sortedProducts.map(item => (
                        <Item key={item.id} {...item} />
                    ))}
                </div>
            )}
            <div className="category-loadmore">
                {t('pages:exploreMore')}
            </div>
        </div>
    );
}