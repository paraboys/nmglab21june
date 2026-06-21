<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Models\Board;
use Illuminate\Http\JsonResponse;

class BoardController extends Controller
{
    public function index(): JsonResponse
    {
        $boards = Board::with('lists.cards')->latest()->get();
        return response()->json($boards);
    }

    public function store(StoreBoardRequest $request): JsonResponse
    {
        $board = Board::create($request->validated());
        return response()->json($board, 201);
    }

    public function show(Board $board): JsonResponse
    {
        return response()->json($board->load('lists.cards.tags', 'lists.cards.members'));
    }

    public function update(UpdateBoardRequest $request, Board $board): JsonResponse
    {
        $board->update($request->validated());
        return response()->json($board);
    }

    public function destroy(Board $board): JsonResponse
    {
        $board->delete();
        return response()->json(null, 204);
    }
}
