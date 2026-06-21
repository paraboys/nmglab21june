import React, { useState } from 'react';
import { createCard, updateCard, deleteCard } from '../services/api';

export default function Card({ card, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await updateCard(card.id, {
        title: title.trim(),
        description: description.trim(),
      });
      setIsEditing(false);
      onUpdate?.(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update card');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await deleteCard(card.id);
      onDelete?.(card.id);
    } catch (err) {
      alert('Failed to delete card');
    }
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description || '');
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="card card--editing">
        <form onSubmit={handleSave}>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title..."
            autoFocus
          />
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={3}
          />
          {error && <p className="error-text">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !title.trim()}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card" onClick={() => setIsEditing(true)}>
      <h4 className="card__title">{card.title}</h4>
      {card.description && (
        <p className="card__description">{card.description}</p>
      )}
      <div className="card__actions">
        <button
          className="card__edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="card__delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
