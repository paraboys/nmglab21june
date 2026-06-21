# Kanban Pro

A full-stack Kanban board application built with **Laravel 12** (API backend) and **React + Vite** (frontend).

## What It Does

Kanban Pro is a project management tool inspired by Trello. You can:

- Create and manage **boards** (projects)
- Add **lists** inside boards (columns like To-Do, Doing, Done)
- Create **cards** within lists (tasks)
- Edit card title, description, and move cards between lists
- Add **colored tags** to cards (bug, feature, design, urgent)
- Create **members** and assign them to cards (shown as initials avatar)
- Set **due dates** on cards — overdue cards are highlighted with a red border and "OVERDUE" label

## Tech Stack & Models

### Backend — Laravel 12
| Model | Purpose | Key Relationships |
|-------|---------|-------------------|
| `Board` | Top-level project container | HasMany BoardList, HasMany Card |
| `BoardList` | Column inside a board (e.g. To-Do) | BelongsTo Board, HasMany Card |
| `Card` | Task/item inside a list | BelongsTo Board, BelongsTo BoardList, BelongsToMany Tag, BelongsToMany Member |
| `Tag` | Colored label (bug, feature, etc.) | BelongsToMany Card |
| Member | Person assignable to cards | BelongsToMany Card |

**Why these models**: A board has lists, lists have cards. Cards can have multiple tags and many-to-many with members. This is a classic Kanban domain model.

### Frontend — React 18 + Vite
- HashRouter for client-side routing
- Axios for API calls
- CSS custom properties for dark theme
- No external state library (useState + useEffect)

## Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API will be available at `http://localhost:8000/api`.

### Frontend (React SPA)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Live URL 
frontend: `https://hermes-kanban-frontend.vercel.app/ `
API: `https://hermes-kanban-api.onrender.com`

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

## Project Structure

```
kanban-pro/
├── backend/          # Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # BoardController, BoardListController, CardController, TagController, MemberController
│   │   ├── Http/Requests/          # StoreCardRequest, UpdateCardRequest
│   │   └── Models/                 # Board, BoardList, Card, Tag, Member
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
├── skills/
│   └── kanban-pro/SKILL.md         # Reusable skill for Hermes
├── slack-export/                    # Proof of Slack chat loop
├── ARCHITECTURE.md                  # Technical + agent architecture
├── agent-log.md                     # Unedited agent work log
├── openclaw.json                    # Agent/channel/model config
├── config.yaml                      # Hermes config (secrets removed)
├── .env.example                     # Environment variable template
└── README.md                        # This file
```

## License

MIT
