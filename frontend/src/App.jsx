import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';

export default function App() {
  const [boards, setBoards] = useState([]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home boards={boards} setBoards={setBoards} />} />
        <Route path="/boards/:boardId" element={<Board boards={boards} setBoards={setBoards} />} />
      </Routes>
    </HashRouter>
  );
}
