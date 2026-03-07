
const IS_DEV = import.meta.env.DEV;

export const BASE_URL = IS_DEV
    ? "http://192.168.29.245:8080"
    : "https://api-gateway-production-eee05.up.railway.app";

export const WS_URL = IS_DEV
    ? "ws://192.168.29.245:8080/ws"
    : "wss://api-gateway-production-ee05.up.railway.app/ws";

export const MOBILE_URL = "http://192.168.29.245:5173";

export const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

export const TURN_CREDENTIALS_API = `${BASE_URL}/api/turn-credentials`;
