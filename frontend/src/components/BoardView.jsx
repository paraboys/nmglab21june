import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { createList, fetchBoard, fetchTags, fetchMembers, createMember } from '../services/api';
import ListColumn from './ListColumn';
import { LoadingOverlay, ErrorMessage } from './common/Spinner';

export default function BoardView({ board: propBoard, onBoardsChange }) {
  const { boardId } = useParams();
  const [board, setBoard] = useState(propBoard || null);
  const [loading, setLoading] = useState(!propBoard);
  const [error, setError] = useState(null);
  const [showAddList, setShowAddList] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [addingList, setAddingList] = useState(false);

  // Tag / Member management
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const loadBoard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchBoard(boardId);
      setBoard(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!listTitle.trim()) return;
    setAddingList(true);
    try {
      const { data } = await createList(boardId, { title: listTitle.trim() });
      setBoard((prev) => ({
        ...prev,
        lists: [...(prev.lists || []), { ...data, cards: [] }],
      }));
      setListTitle('');
      setShowAddList(false);
      onBoardsChange?.();
    } catch (err) {
      alert('Failed to create list');
    } finally {
      setAddingList(false);
    }
  };

  const handleCardCreated = async () => {
    await loadBoard();
  };

  const handleCardUpdated = async (updatedCard) => {
    setBoard((prev) => {
      const newLists = prev.lists.map((list) => {
        if (list.id === updatedCard.list_id) {
          return {
            ...list,
            cards: list.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
          };
        }
        return list;
      });
      return { ...prev, lists: newLists };
    });
  };

  const handleCardDeleted = async (cardId, listId) => {
    setBoard((prev) => {
      const newLists = prev.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.filter((c) => c.id !== cardId),
          };
        }
        return list;
      });
      return { ...prev, lists: newLists };
    });
  };

  // --- Member management ---
  const openMemberModal = async () => {
    setShowMemberModal(true);
    setNewMemberName('');
    setNewMemberEmail('');
    try {
      const { data } = await fetchMembers();
      setMembers(data);
    } catch {
      setMembers([]);
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setAddingMember(true);
    try {
      const { data } = await createMember({
        name: newMemberName.trim(),
        email: newMemberEmail.trim() || `${newMemberName.trim().toLowerCase().replace(/\s+/g, '.')}@local`,
      });
      setMembers((prev) => [...prev, data]);
      setNewMemberName('');
      setNewMemberEmail('');
    } catch (err) {
      alert('Failed to create member');
    } finally {
      setAddingMember(false);
    }
  };

  if (loading) return <LoadingOverlay message="Loading board..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadBoard} />;
  if (!board) return <ErrorMessage message="Board not found" />;

  return (
    <div className="board-view">
      <div className="board-view__header">
        <div className="board-view__header-left">
          <Link to="/" className="board-view__back-btn">← Boards</Link>
          <h1 className="board-view__title">{board.title}</h1>
          <button className="btn btn-ghost btn-sm" onClick={openMemberModal}>
            👥 Members
          </button>
        </div>
        {board.description && (
          <p className="board-view__description">{board.description}</p>
        )}
      </div>

      <div className="board-view__lists">
        {(board.lists || []).map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            onCardCreated={handleCardCreated}
            onCardUpdated={handleCardUpdated}
            onCardDeleted={handleCardDeleted}
          />
        ))}

        {showAddList ? (
          <div className="list-column list-column--add">
            <form onSubmit={handleAddList}>
              <input
                type="text"
                className="input"
                placeholder="List title..."
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                autoFocus
              />
              <div className="form-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setShowAddList(false); setListTitle(''); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={addingList || !listTitle.trim()}>
                  {addingList ? 'Adding...' : 'Add List'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button className="board-view__add-list-btn" onClick={() => setShowAddList(true)}>
            + Add another list
          </button>
        )}
      </div>

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Manage Members</h2>
              <button className="modal__close" onClick={() => setShowMemberModal(false)}>✕</button>
            </div>

            <form className="modal__form" onSubmit={handleCreateMember}>
              <input
                type="text"
                className="input"
                placeholder="Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <input
                type="email"
                className="input"
                placeholder="Email (optional)"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={addingMember || !newMemberName.trim()}>
                {addingMember ? 'Creating...' : 'Create Member'}
              </button>
            </form>

            <div className="modal__members-list">
              {members.length === 0 ? (
                <p className="modal__empty">No members yet. Create one above.</p>
              ) : (
                members.map((m) => (
                  <div key={m.id} className="modal__member-item">
                    <span className="card__member-avatar">{m.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</span>
                    <div className="modal__member-info">
                      <span className="modal__member-name">{m.name}</span>
                      <span className="modal__member-email">{m.email}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
