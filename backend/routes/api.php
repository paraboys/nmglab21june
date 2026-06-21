<?php

use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\BoardListController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Boards
Route::apiResource('boards', BoardController::class);

// Board Lists (nested under boards)
Route::get('boards/{board}/lists', [BoardListController::class, 'index']);
Route::post('boards/{board}/lists', [BoardListController::class, 'store']);

// Board List (standalone operations)
Route::apiResource('board-lists', BoardListController::class)->only(['show', 'update', 'destroy']);

// Cards (nested under board-lists)
Route::get('board-lists/{boardList}/cards', [CardController::class, 'index']);
Route::post('board-lists/{boardList}/cards', [CardController::class, 'store']);

// Card (standalone operations)
Route::apiResource('cards', CardController::class)->only(['show', 'update', 'destroy']);

// Tags
Route::apiResource('tags', TagController::class);

// Members
Route::apiResource('members', MemberController::class);
