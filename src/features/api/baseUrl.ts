export const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const CLEAN_URL= baseUrl.replace(/^https?:\/\//, '');
console.log(CLEAN_URL);
