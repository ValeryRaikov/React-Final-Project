export const sortProducts = (products, option) => {
    return [...products].sort((a, b) => {
        if (option === 'id-asc') 
            return a._id.localeCompare(b._id);
        if (option === 'id-desc') 
            return b._id.localeCompare(a._id);
        if (option === 'newPrice-asc') 
            return a.newPrice - b.newPrice;
        if (option === 'newPrice-desc') 
            return b.newPrice - a.newPrice;
        if (option === 'likes-desc') 
            return (b.likes?.length || 0) - (a.likes?.length || 0);
        if (option === 'comments-desc') 
            return (b.comments?.length || 0) - (a.comments?.length || 0);
    });
};