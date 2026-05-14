import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const ingestData = () => API.post('/ingest');
export const sendMessage = (message, sessionId) => API.post('/chat', { message, sessionId });
export const getSession = (sessionId) => API.get(`/history/${sessionId}`);
export const getHistory = () => API.get('/history');

export const analyzeArticle = (text) => API.post('/analyze/article', { text });
export const analyzeDeepDive = (text) => API.post('/analyze/deep-dive', { text });