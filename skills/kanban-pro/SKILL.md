---
name: kanban-pro
description: Build, fix, and maintain the Kanban Pro full-stack app (Laravel API + React frontend). Use for any task involving boards, lists, cards, tags, members, due dates, or card CRUD.
---

# Kanban Pro Skill

## Purpose
Procedures and conventions for working on the Kanban Pro application.

## Project Structure
```
kanban-pro/
├── backend/          # Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # BoardController, BoardListController, CardController, TagController, MemberController
│   │   ├── Http/Requests/          # StoreCardRequest, UpdateCardRequest, etc.
│   │   └── Models/                 # Board, BoardList, Card, Tag, Member
│   ├── database/migrations/
│   ├── database/seeders/
│   ├── routes/api.php
│   └── .env
├── frontend/         # React + Vite SPA
│   ├── src/
│   │   ├── components/  # Sidebar, BoardView, ListColumn, Card, Spinner
│   │   ├── pages/        # Home, Board
│   │   ├── services/     # api.js (Axios)
│   │   └── App.css
│   └── .env
├── ARCHITECTURE.md
├── agent-log.md
└── .env.example
```

## How to Start

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
# → http://localhost:8000/api
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Key Conventions

### API Design
- Nested routes for creation: `POST /boards/{board}/lists`, `POST /board-lists/{list}/cards`
- Standard resource routes for show/update/destroy
- Validation via FormRequest classes (`StoreCardRequest`, `UpdateCardRequest`)
- `board_id` is derived from the route model binding, NOT from the request body for card creation
- `list_id` comes from the URL parameter for card creation, so the StoreCardRequest uses `sometimes` (not `required`) for `list_id`

### Frontend API Client
- Single Axios instance in `frontend/src/services/api.js`
- Base URL: `http://localhost:8000/api`
- Named exports per resource operation
- Frontend does NOT send `list_id` or `board_id` when creating cards — these come from the route

### Common Pitfalls
1. **Card creation fails with "list_id required"**: The frontend doesn't send `list_id` in the body. The `StoreCardRequest` must use `'list_id' => 'sometimes|exists:board_lists,id'` (NOT `required`). The `list_id` is set implicitly via `$boardList->cards()->create($data)`.
2. **PHP on Windows**: The Scoop PHP shim is broken under MSYS. Use `execute_code` + Python subprocess with `C:\php\php.exe` for artisan commands.
3. **Vite dev server**: Must run separately from Laravel. CORS is configured in Laravel to allow `http://localhost:5173`.

### Models & Relationships
- `Board` → `HasMany BoardList`, `HasMany Card`
- `BoardList` → `BelongsTo Board`, `HasMany Card`
- `Card` → `BelongsTo Board`, `BelongsTo BoardList`, `BelongsToMany Tag`, `BelongsToMany Member`
- `Tag` → `BelongsToMany Card`
- `Member` → `BelongsToMany Card`

### Database
- SQLite by default (`database/database.sqlite`)
- Pivot tables: `card_tag`, `card_member`
- Seeder creates default tags: bug (#f85149), feature (#3fb950), design (#58a6ff), urgent (#d29922)

## Verification Checklist
When making changes, verify these work via API calls or UI:
- [ ] Create card (POST /board-lists/{id}/cards with title, description)
- [ ] Edit card (PUT /cards/{id})
- [ ] Delete card (DELETE /cards/{id})
- [ ] Create board → lists → cards hierarchy
- [ ] Move card between lists
- [ ] Tags display on cards
- [ ] Members assigned to cards
- [ ] Due dates set and overdue flagged
