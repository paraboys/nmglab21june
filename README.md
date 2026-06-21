# Kanban Pro

A full-stack Kanban board application built with **Laravel 12** (API backend) and **React + Vite** (frontend).

## Features

- Create and manage boards
- Create lists inside boards
- Create, edit, and delete cards within lists
- Modern dark UI, responsive design
- RESTful API

## Project Structure

```
kanban-pro/
├── backend/          # Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # BoardListController, CardController, BoardController
│   │   ├── Models/                 # Board, BoardList, Card, Tag, Member
│   │   └── ...
│   ├── routes/api.php
│   └── ...
├── frontend/         # React + Vite SPA
│   ├── src/
│   │   ├── components/  # Sidebar, BoardView, ListColumn, Card, Spinner
│   │   ├── pages/        # Home, Board
│   │   ├── services/     # api.js (Axios)
│   │   └── ...
│   └── ...
├── ARCHITECTURE.md
├── agent-log.md
└── .env.example
```

## Quick Start

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API will be available at `http://localhost:8000/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | List all boards |
| POST | `/api/boards` | Create a board |
| GET | `/api/boards/{id}` | Get board with lists & cards |
| PUT | `/api/boards/{id}` | Update a board |
| DELETE | `/api/boards/{id}` | Delete a board |
| GET | `/api/boards/{board}/lists` | List board lists |
| POST | `/api/boards/{board}/lists` | Create a list |
| PUT | `/api/board-lists/{id}` | Update a list |
| DELETE | `/api/board-lists/{id}` | Delete a list |
| GET | `/api/board-lists/{list}/cards` | List list cards |
| POST | `/api/board-lists/{list}/cards` | Create a card |
| PUT | `/api/cards/{id}` | Update a card |
| DELETE | `/api/cards/{id}` | Delete a card |

## License

MIT
