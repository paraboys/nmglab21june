import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBoard, createList } from '../services/api';
import BoardView from '../components/BoardView';
import Sidebar from '../components/Sidebar';
import { LoadingOverlay, ErrorMessage } from '../components/common/Spinner';

export default function BoardPage({ boards, setBoards }) {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const activeBoardId = parseInt(boardId, 10);

  return (
    <div className="app-layout">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={(id) => window.location.href = `/boards/${id}`}
      />
      <main className="main-content">
        {loading ? (
          <LoadingOverlay message="Loading board..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadBoard} />
        ) : (
          <BoardView board={board} onBoardsChange={loadBoard} />
        )}
      </main>
    </div>
  );
}
