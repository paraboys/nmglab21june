import React, { useState } from 'react';
import { createCard, updateCard, deleteCard } from '../services/api';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

function formatDueDate(dueDate) {
  if (!dueDate) return '';
  const d = new Date(dueDate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export default function Card({ card, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.due_date || '');
  const [tagIds, setTagIds] = useState((card.tags || []).map((t) => t.id));
  const [memberIds, setMemberIds] = useState((card.members || []).map((m) => m.id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const overdue = isOverdue(card.due_date);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await updateCard(card.id, {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate || null,
        tag_ids: tagIds,
        member_ids: memberIds,
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
    setDueDate(card.due_date || '');
    setTagIds((card.tags || []).map((t) => t.id));
    setMemberIds((card.members || []).map((m) => m.id));
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
          <div className="card-edit__row">
            <label className="card-edit__label">Due Date</label>
            <input
              type="date"
              className="input input--date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
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
    <div
      className={`card ${overdue ? 'card--overdue' : ''}`}
      onClick={() => setIsEditing(true)}
    >
      {/* Tags */}
      {(card.tags || []).length > 0 && (
        <div className="card__tags">
          {(card.tags || []).map((tag) => (
            <span
              key={tag.id}
              className="card__tag"
              style={{ backgroundColor: tag.color + '22', color: tag.color, borderColor: tag.color + '44' }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <h4 className="card__title">{card.title}</h4>

      {card.description && (
        <p className="card__description">{card.description}</p>
      )}

      {/* Footer: due date + member */}
      <div className="card__footer">
        {card.due_date && (
          <span className={`card__due-date ${overdue ? 'card__due-date--overdue' : ''}`}>
            {overdue && <span className="card__overdue-label">OVERDUE</span>}
            {!overdue && <span className="card__due-icon">📅</span>}
            {formatDueDate(card.due_date)}
          </span>
        )}
        {(card.members || []).length > 0 && (
          <div className="card__members">
            {(card.members || []).map((member) => (
              <span
                key={member.id}
                className="card__member-avatar"
                title={member.name}
              >
                {getInitials(member.name)}
              </span>
            ))}
          </div>
        )}
      </div>

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
