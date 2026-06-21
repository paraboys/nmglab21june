import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBoards } from '../services/api';
import Sidebar from '../components/Sidebar';
import { LoadingOverlay, ErrorMessage } from '../components/common/Spinner';

export default function HomePage({ boards, setBoards }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchBoards();
      setBoards(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [newBoard, ...prev]);
  };

  const handleSelectBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <div className="app-layout">
      <Sidebar
        boards={boards}
        onSelectBoard={handleSelectBoard}
        onBoardCreated={handleBoardCreated}
      />
      <main className="main-content">
        {loading ? (
          <LoadingOverlay message="Loading boards..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadBoards} />
        ) : (
          <div className="home-content">
            <div className="home-content__header">
              <h1>Welcome to Task Boards</h1>
              <p>Select a board from the sidebar or create a new one</p>
            </div>

            {boards.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📋</div>
                <h2>No boards yet</h2>
                <p>Create your first board to get started</p>
              </div>
            ) : (
              <div className="boards-grid">
                {boards.map((board) => (
                  <div
                    key={board.id}
                    className="board-card"
                    onClick={() => handleSelectBoard(board.id)}
                  >
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
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
