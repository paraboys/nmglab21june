import React, { useState } from 'react';
import Card from './Card';
import { createCard } from '../services/api';

export default function ListColumn({ list, onCardCreated, onCardUpdated, onCardDeleted }) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardDueDate, setCardDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title: cardTitle.trim(),
        description: cardDesc.trim(),
      };
      if (cardDueDate) {
        payload.due_date = cardDueDate;
      }
      const { data } = await createCard(list.id, payload);
      setCardTitle('');
      setCardDesc('');
      setCardDueDate('');
      setShowAddCard(false);
      onCardCreated?.(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCardTitle('');
    setCardDesc('');
    setCardDueDate('');
    setShowAddCard(false);
    setError(null);
  };

  return (
    <div className="list-column">
      <div className="list-column__header">
        <h3 className="list-column__title">{list.title}</h3>
        <span className="list-column__count">{list.cards?.length || 0}</span>
      </div>

      <div className="list-column__cards">
        {(list.cards || []).map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={(updated) => onCardUpdated?.(updated)}
            onDelete={(cardId) => onCardDeleted?.(cardId, list.id)}
          />
        ))}
      </div>

      {showAddCard ? (
        <div className="list-column__add-form">
          <form onSubmit={handleAddCard}>
            <input
              type="text"
              className="input"
              placeholder="Card title..."
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="textarea"
              placeholder="Description (optional)"
              value={cardDesc}
              onChange={(e) => setCardDesc(e.target.value)}
              rows={2}
            />
            <div className="card-edit__row">
              <label className="card-edit__label">Due Date</label>
              <input
                type="date"
                className="input input--date"
                value={cardDueDate}
                onChange={(e) => setCardDueDate(e.target.value)}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !cardTitle.trim()}>
                {loading ? 'Adding...' : 'Add Card'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="list-column__add-btn" onClick={() => setShowAddCard(true)}>
          + Add a card
        </button>
      )}
    </div>
  );
}
