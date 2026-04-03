export const filterProducts = (products, filters) => {
    const {
        category,
        searchQuery,
        stockFilter,
        subcategoryFilter,
        maxPrice,
        minPrice,
        officeFilter
    } = filters;

    return products
        .filter(p => p.category === category)
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(p => {
            if (stockFilter === 'in') 
                return p.available;
            if (stockFilter === 'out') 
                return !p.available;

            return true;
        })
        .filter(p => subcategoryFilter === 'all' || p.subcategory === subcategoryFilter)
        .filter(p => !maxPrice || p.newPrice <= Number(maxPrice))
        .filter(p => !minPrice || p.newPrice >= Number(minPrice))
        .filter(p => {
            if (officeFilter === 'all') 
                return true;
            
            return p.officeIds?.includes(officeFilter);
        });
};