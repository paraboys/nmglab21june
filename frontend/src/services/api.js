import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Boards
export const fetchBoards = () => api.get('/boards');
export const fetchBoard = (id) => api.get(`/boards/${id}`);
export const createBoard = (data) => api.post('/boards', data);
export const updateBoard = (id, data) => api.put(`/boards/${id}`, data);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);

// Lists
export const fetchLists = (boardId) => api.get(`/boards/${boardId}/lists`);
export const createList = (boardId, data) => api.post(`/boards/${boardId}/lists`, data);
export const updateList = (id, data) => api.put(`/board-lists/${id}`, data);
export const deleteList = (id) => api.delete(`/board-lists/${id}`);

// Cards
export const fetchCards = (listId) => api.get(`/board-lists/${listId}/cards`);
export const createCard = (listId, data) => api.post(`/board-lists/${listId}/cards`, data);
export const updateCard = (id, data) => api.put(`/cards/${id}`, data);
export const deleteCard = (id) => api.delete(`/cards/${id}`);

export default api;
