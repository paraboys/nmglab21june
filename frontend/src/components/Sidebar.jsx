import React, { useState } from 'react';
import { createBoard } from '../services/api';

function AddBoardCard({ onCreated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await createBoard({ title: title.trim() });
      setTitle('');
      setIsEditing(false);
      onCreated?.(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsEditing(false);
    setError(null);
  };

  if (!isEditing) {
    return (
      <div className="board-card board-card--add" onClick={() => setIsEditing(true)}>
        <div className="board-card__icon">+</div>
        <span>Create new board</span>
      </div>
    );
  }

  return (
    <div className="board-card board-card--editing">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input input--inline"
          placeholder="Board title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        {error && <p className="error-text">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

function BoardCard({ board }) {
  return (
    <div className="board-card">
      <div className="board-card__header">
        <h3 className="board-card__title">{board.title}</h3>
      </div>
      <p className="board-card__description">
        {board.description || 'No description'}
      </p>
      <div className="board-card__footer">
        <span className="board-card__meta">
          {board.lists?.length || 0} lists
        </span>
        <span className="board-card__meta">
          {board.lists?.reduce((acc, l) => acc + (l.cards?.length || 0), 0) || 0} cards
        </span>
      </div>
    </div>
  );
}

export default function Sidebar({ boards, activeBoardId, onSelectBoard, onBoardCreated }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__logo">📋 Task Boards</h2>
      </div>

      <div className="sidebar__section">
        <h3 className="sidebar__section-title">Your Boards</h3>
        <div className="sidebar__boards">
          {boards.map((board) => (
            <button
              key={board.id}
              className={`sidebar__board-btn ${activeBoardId === board.id ? 'active' : ''}`}
              onClick={() => onSelectBoard(board.id)}
            >
              <span className="sidebar__board-icon">📌</span>
              <span className="sidebar__board-name">{board.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar__add">
        <AddBoardCard
          onCreated={(board) => {
            onBoardCreated?.(board);
          }}
        />
      </div>
    </aside>
  );
}
