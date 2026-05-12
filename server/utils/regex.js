// utils/regex.js - Regular expressions for validating admin input (names, emails, passwords)

export const nameRegex = /^[a-z ,.'-]+$/i;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;