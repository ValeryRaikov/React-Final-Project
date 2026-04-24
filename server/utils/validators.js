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

// Generate a strong random password for Google/OAuth users
export const generateSecurePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*_-+=';

    // Ensure at least one of each required character type
    const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)];
    const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];

    // Generate remaining random characters
    const allChars = lowercase + uppercase + numbers + specialChars;
    let password = randomLower + randomUpper + randomNumber + randomSpecial;

    for (let i = password.length; i < 16; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
};