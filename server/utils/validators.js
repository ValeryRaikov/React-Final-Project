import { nameRegex, emailRegex, passwordRegex } from './regex.js';

export const isValidName = (name) => {
    return nameRegex.test(name);
};

export const isValidEmail = (email) => {
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    return passwordRegex.test(password);
};