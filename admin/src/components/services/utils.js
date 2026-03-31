export const errMsg = {
    fetchProduct: 'Error! Failed to fetch product.',
    fetchProducts: 'Error! Failed to fetch products.',
    uploadImage: 'Error! Failed to upload product image to the server.',
    createProduct: 'Error! Failed to create product.',
    updateProduct: 'Error! Failed to update product.',
    deleteProduct: 'Error! Failed to delete product.',
    unexpected: 'An unexpected error occurred. Please try again later.',
};

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const percentageToMultiplier = (percentage) => {
    if (percentage <= 0 || percentage > 100) {
        throw new Error('Percentage must be between 1 and 100');
    }
    return 1 - (percentage / 100);
};

export const multiplierToPercentage = (multiplier) => {
    if (multiplier <= 0 || multiplier > 1) {
        throw new Error('Multiplier must be between 0 and 1');
    }
    return Math.round((1 - multiplier) * 100);
};