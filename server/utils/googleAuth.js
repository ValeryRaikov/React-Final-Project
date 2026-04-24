import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'postmessage'
);

// Verify Google authorization code
export const verifyGoogleCode = async (code) => {
    try {
        const { tokens } = await client.getToken(code);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return {
            success: true,
            data: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
            },
        };
    } catch (error) {
        console.error('Google token verification error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

// Alternative: Verify Google ID Token directly (if using implicit flow)
export const verifyGoogleIdToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return {
            success: true,
            data: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
            },
        };
    } catch (error) {
        console.error('Google ID token verification error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};
