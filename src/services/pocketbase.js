// src/services/pocketbase.js
import PocketBase from 'pocketbase';

// PERMANENT STATIC IP (NEVER CHANGES)
export const pb = new PocketBase('http://192.168.10.100:8090');

pb.authStore.onChange(() => {
  localStorage.setItem('pb_auth', JSON.stringify(pb.authStore.exportToCookie()));
});