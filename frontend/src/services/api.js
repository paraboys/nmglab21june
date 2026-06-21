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

// Tags
export const fetchTags = () => api.get('/tags');
export const createTag = (data) => api.post('/tags', data);
export const updateTag = (id, data) => api.put(`/tags/${id}`, data);
export const deleteTag = (id) => api.delete(`/tags/${id}`);

// Members
export const fetchMembers = () => api.get('/members');
export const createMember = (data) => api.post('/members', data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

export default api;
