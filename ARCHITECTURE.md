# Architecture

## Overview

Kanban Pro is a full-stack SPA with a decoupled architecture:

- **Backend**: Laravel 12 REST API (serves JSON, no views)
- **Frontend**: React 18 + Vite SPA (consumes API via Axios)

## Backend Architecture

### Models

```
Board
├── id, title, description, timestamps
├── HasMany BoardList (ordered by position)
└── HasMany Card

BoardList
├── id, board_id, title, position, timestamps
├── BelongsTo Board
└── HasMany Card (ordered by position, list_id foreign key)

Card
├── id, board_id, list_id, title, description, position, due_date, timestamps
├── BelongsTo Board
├── BelongsTo BoardList (via list_id)
├── BelongsToMany Tag
└── BelongsToMany Member

Tag
├── id, name, color, timestamps
└── BelongsToMany Card

Member
├── id, name, email, timestamps
└── BelongsToMany Card
```

### API Design

- RESTful resource controllers under `App\Http\Controllers\Api`
- Eager loading: `Board::with('lists.cards')` on index, deeper with tags/members on show
- Nested routes for creation: `POST /boards/{board}/lists`, `POST /board-lists/{list}/cards`
- Standard resource routes for show/update/destroy

### Database

- SQLite by default (configurable via `.env`)
- Migrations for all tables + pivot tables (`card_tag`, `card_member`)

## Frontend Architecture

### Routing

- `HashRouter` (no server-side routing needed)
- `/` → `Home` page (board grid)
- `/boards/:boardId` → `Board` page (lists + cards)

### Component Tree

```
App (HashRouter)
├── Home
│   └── Sidebar
│       └── AddBoardCard
│   └── BoardCard[] (grid)
└── Board
    └── Sidebar
    └── BoardView
        └── ListColumn[]
            └── Card[]
```

### State Management

- Simple `useState` + `useEffect` (no external state library)
- Board list state lifted to `App` component
- BoardView refreshes on mutations via callback pattern

### Styling

- CSS custom properties for theming (dark theme)
- Single `App.css` + `index.css` (no CSS framework)
- CSS variables: `--bg-primary`, `--text-primary`, `--accent-primary`, etc.

### API Client

- Single Axios instance in `src/services/api.js`
- Base URL: `http://localhost:8000/api`
- Named exports per resource operation

## Data Flow

```
User action → Component handler → API call (Axios) → Laravel API
                ← JSON response ←                    ← Eloquent JSON
```

## Environment

| Variable | Backend Value | Frontend Value |
|----------|--------------|----------------|
| `APP_URL` | `http://localhost:8000` | N/A |
| API URL | N/A | `http://localhost:8000/api` |
| DB | SQLite | N/A |
