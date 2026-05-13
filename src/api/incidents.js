import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5050';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

function unwrap(promise) {
  return promise
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        const { status, statusText } = error.response;
        throw new Error(`Сервер вернул ${status} ${statusText || ''}`.trim());
      }
      if (error.request) {
        throw new Error('Сервер недоступен. Проверьте, запущен ли json-server на порту 5050.');
      }
      throw new Error(error.message || 'Неизвестная ошибка запроса');
    });
}

export const incidentsApi = {
  list: () => unwrap(api.get('/incidents')),
  get: (id) => unwrap(api.get(`/incidents/${id}`)),
  create: (data) => unwrap(api.post('/incidents', JSON.stringify(data))),
  update: (id, data) => unwrap(api.put(`/incidents/${id}`, JSON.stringify(data))),
  remove: (id) => unwrap(api.delete(`/incidents/${id}`)),
};
