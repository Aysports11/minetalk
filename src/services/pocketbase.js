// src/services/pocketbase.js
import PocketBase from 'pocketbase';

// Auto-detect: Web (localhost) vs Android (your IP)
const isWeb = !window.cordova && !window.Capacitor;
const baseUrl = isWeb ? 'http://127.0.0.1:8090' : 'http://192.168.10.30:8090';

export const pb = new PocketBase(baseUrl);