import { BASE_URL } from '../config';

export const createSession = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true", // Bypass ngrok browser warning
                // 'User-Agent': 'ConnectX-WebApp', // Also sometimes helps
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to create session:', error);
        throw error;
    }
};
