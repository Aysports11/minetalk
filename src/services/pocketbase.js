// src/services/pocketbase.js
import PocketBase from 'pocketbase';

// YOUR LOCAL IP — WORKS ON PHONE (SAME WIFI)
export const pb = new PocketBase('http://192.168.10.19:8090');

pb.authStore.onChange(() => {
  localStorage.setItem('pb_auth', JSON.stringify(pb.authStore.exportToCookie()));
});