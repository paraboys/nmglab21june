# Kanban Pro

A full-stack Kanban board application built with **Laravel 12** (API backend) and **React + Vite** (frontend).

## Features

- Create and manage boards
- Create lists inside boards
- Create, edit, and delete cards within lists
- **Tags** — colored labels (bug, feature, design, urgent) on cards
- **Members** — create members, assign to cards, display initials avatar
- **Due Dates** — set due dates on cards, overdue cards highlighted with red border and "OVERDUE" label
- Modern dark UI, responsive design
- RESTful API

## Project Structure

```
kanban-pro/
├── backend/          # Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # BoardController, BoardListController, CardController, TagController, MemberController
│   │   ├── Models/                 # Board, BoardList, Card, Tag, Member
│   │   └── ...
│   ├── database/
│   │   ├── migrations/             # All table + pivot migrations
│   │   └── seeders/                # DatabaseSeeder (default tags)
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
php artisan migrate --seed
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
| GET | `/api/boards/{id}` | Get board, lists, cards (with tags & members) |
| PUT | `/api/boards/{id}` | Update a board |
| DELETE | `/api/boards/{id}` | Delete a board |
| GET | `/api/boards/{board}/lists` | List board lists |
| POST | `/api/boards/{board}/lists` | Create a list |
| PUT | `/api/board-lists/{id}` | Update a list |
| DELETE | `/api/board-lists/{id}` | Delete a list |
| GET | `/api/board-lists/{list}/cards` | List list cards (with tags & members) |
| POST | `/api/board-lists/{list}/cards` | Create a card |
| PUT | `/api/cards/{id}` | Update a card (title, description, due_date, tag_ids, member_ids) |
| DELETE | `/api/cards/{id}` | Delete a card |
| GET | `/api/tags` | List all tags |
| POST | `/api/tags` | Create a tag |
| PUT | `/api/tags/{id}` | Update a tag |
| DELETE | `/api/tags/{id}` | Delete a tag |
| GET | `/api/members` | List all members |
| POST | `/api/members` | Create a member |
| PUT | `/api/members/{id}` | Update a member |
| DELETE | `/api/members/{id}` | Delete a member |

## Default Tags

The database seeder creates these tags automatically:

| Tag | Color |
|-----|-------|
| bug | `#f85149` (red) |
| feature | `#3fb950` (green) |
| design | `#58a6ff` (blue) |
| urgent | `#d29922` (orange) |

## Card JSON Example

```json
{
  "id": 1,
  "list_id": 1,
  "title": "Setup database",
  "description": "Create migrations for all tables.",
  "due_date": "2024-01-05",
  "tags": [
    {"id": 1, "name": "bug", "color": "#f85149"},
    {"id": 4, "name": "urgent", "color": "#d29922"}
  ],
  "members": [
    {"id": 1, "name": "John Doe", "email": "john@example.com"}
  ]
}
```

## License

MIT
