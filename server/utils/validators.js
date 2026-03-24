import { emailRegex, passwordRegex } from './regex.js';

export const isValidEmail = (email) => {
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    return passwordRegex.test(password);
};