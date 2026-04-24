import axios from 'axios';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

// Verify reCAPTCHA v2 token
export const verifyRecaptcha = async (token) => {
    try {
        const response = await axios.post(RECAPTCHA_VERIFY_URL, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: token,
            },
        });

        const data = response.data;

        if (data.success && data.score !== undefined) {
            // reCAPTCHA v3
            return {
                success: true,
                score: data.score,
                action: data.action,
                challengeTs: data.challenge_ts,
                hostname: data.hostname,
            };
        } else if (data.success) {
            // reCAPTCHA v2
            return {
                success: true,
                challengeTs: data.challenge_ts,
                hostname: data.hostname,
            };
        } else {
            return {
                success: false,
                errors: data['error-codes'] || ['reCAPTCHA verification failed'],
            };
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return {
            success: false,
            errors: [error.message],
        };
    }
};
