import { fuzzySearchProducts } from './fuzzySearch.js';

export const filterProducts = (products, filters) => {
    const {
        category,
        searchQuery = '',
        stockFilter = 'all',
        subcategoryFilter = 'all',
        maxPrice = '',
        minPrice = '',
        officeFilter = 'all',
        isExactMatch = false
    } = filters;

    const search = searchQuery.trim().toLowerCase();
    const max = maxPrice ? Number(maxPrice) : null;
    const min = minPrice ? Number(minPrice) : null;

    let filtered = products;

    // Apply fuzzy search if search query exists
    if (search) {
        if (isExactMatch) {
            // 🔴 STRICT MATCH ONLY
            filtered = products.filter(p =>
                p.name.toLowerCase() === search
            );
        } else {
            // 🔴 NORMAL FUZZY SEARCH
            filtered = fuzzySearchProducts(products, searchQuery, ['name', 'description'], 2);
        }
    }

    // Apply other filters
    return filtered.filter(p => {
        // Category
        if (category && p.category !== category) 
            return false;

        // Stock
        if (stockFilter === 'in' && !p.available) 
            return false;
        if (stockFilter === 'out' && p.available) 
            return false;

        // Subcategory
        if (subcategoryFilter !== 'all' && p.subcategory !== subcategoryFilter) 
            return false;

        // Price
        if (max !== null && p.newPrice > max) 
            return false;
        if (min !== null && p.newPrice < min) 
            return false;

        // Office
        if (officeFilter !== 'all') {
            const officeIds = p.officeIds || [];
            if (!officeIds.includes(officeFilter)) 
                return false;
        }

        return true;
    });
};