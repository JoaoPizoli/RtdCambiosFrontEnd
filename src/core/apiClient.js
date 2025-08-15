import { API_BASE } from './config.js';
import { ApiError, createErrorFromStatus } from './erroHandler.js';

export async function apiCall(path, { method = 'GET', body, auth = true } = {}) {
    if (!path) throw new Error('path obrigatório');
    const url = API_BASE + (path.startsWith('/') ? path : '/' + path);

    const headers = { 'Content-Type': 'application/json' };
    const token = auth ? localStorage.getItem('token') : null;
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    const options = { method, headers };
    if (body && method !== 'GET' && method !== 'HEAD') {
        options.body =  JSON.stringify(body);
    }

    try {
        const res = await fetch(url, options);
        let data = null;
        if (res.status !== 204) {
            try { data = await res.json(); } catch { data = null; }
        }

        if (!res.ok) {
            throw createErrorFromStatus(res.status, data?.message);
        }
        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('network', 'Erro ao conectar com o servidor');
    }
}