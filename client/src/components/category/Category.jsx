import { useContext, useState, useEffect, useMemo } from 'react'; 
import { ShopContext } from '../../context/ShopContext';
import { filterProducts } from '../../utils/filters.js';
import { sortProducts } from '../../utils/sortings.js';

import './Category.css';

import Item from '../item/Item';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

export default function Category({ 
    banner,
    category,
}) {
    const { allProducts } = useContext(ShopContext);

    const [offices, setOffices] = useState([]);
    const [sortOption, setSortOption] = useState('id-asc');
    const [searchQuery, setSearchQuery] = useState('');  
    const [searchTrigger, setSearchTrigger] = useState('');  

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [stockFilter, setStockFilter] = useState('all');
    const [subcategoryFilter, setSubcategoryFilter] = useState('all');
    const [officeFilter, setOfficeFilter] = useState('all');
    const [maxPrice, setMaxPrice] = useState('');
    const [minPrice, setMinPrice] = useState('');

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const sortedProducts = useMemo(() => {
        if (!allProducts.length) 
            return [];

        const filtered = filterProducts(allProducts, {
            category,
            searchQuery: searchTrigger,
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
        sortOption,
        searchTrigger,
        stockFilter,
        subcategoryFilter,
        officeFilter,
        maxPrice,
        minPrice
    ]);

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

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    const onSortChange = (value) => {
        setSortOption(value);
    };

    const onSearchChange = (e) => {
        setSearchQuery(e.target.value);  
    };

    const onSearchClick = () => {
        setSearchTrigger(searchQuery); 
    };

    return (
        <div className="category">
            <img className='category-banner' src={banner} alt="" />
            <div className='category-indexSort'>
                <div className="filters-dropdown">
                    <button className="filter-toggle" onClick={toggleFilters}>
                        Filters ▾
                    </button>

                    {showFilters && (
                        <div className="filters-menu">
                            <div className="filter-group">
                                <label>Stock</label>
                                <select onChange={(e) => setStockFilter(e.target.value)} value={stockFilter}>
                                    <option value="all">All</option>
                                    <option value="in">In Stock</option>
                                    <option value="out">Out of Stock</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Type</label>
                                <select onChange={(e) => setSubcategoryFilter(e.target.value)} value={subcategoryFilter}>
                                    <option value="all">All</option>
                                    <option value="shirts">Shirts</option>
                                    <option value="tops">Tops</option>
                                    <option value="jackets">Jackets</option>
                                    <option value="shoes">Shoes</option>
                                    <option value="shirts">Pants</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Office</label>
                                <select 
                                    onChange={(e) => setOfficeFilter(e.target.value)} 
                                    value={officeFilter}
                                >
                                    <option value="all">All</option>
                                    {offices.map(office => (
                                        <option key={office._id} value={office._id}>
                                            {office.name} {!office.isOpen ? '(Closed)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Max Price</label>
                                <input 
                                    type="number"
                                    placeholder="999"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                            <div className="filter-group">
                                <label>Min Price</label>
                                <input 
                                    type="number"
                                    placeholder="1"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="search-bar">
                    <input 
                        value={searchQuery} 
                        onChange={onSearchChange} 
                        type="text" 
                        placeholder="Enter product name..."  
                    />
                    <button onClick={onSearchClick}>Search</button>  
                </div>
                <div className='category-sort'>
                    <label htmlFor="sort">Sort by: </label>
                    <select 
                        id="sort" 
                        value={sortOption} 
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="id-asc">Oldest</option>
                        <option value="id-desc">Newest</option>
                        <option value="newPrice-asc">Cheapest</option>
                        <option value="newPrice-desc">Most Expensive</option>
                        <option value="likes-desc">Most Liked</option>
                        <option value="comments-desc">Most Commented</option>
                    </select>
                </div>
            </div>
            {!allProducts.length 
                ? <div className="loading-spinner"><LoadingSpinner /></div>
                : !sortedProducts.length 
                    ? <p className="error-message">No products found</p>
                    : <div className="category-products">
                        {sortedProducts.map(item => (
                            <Item key={item.id} {...item} />
                        ))}
                    </div>
            }

            <div className="category-loadmore">
                Explore More
            </div>
        </div>
    );
}