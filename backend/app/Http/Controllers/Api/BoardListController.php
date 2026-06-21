<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoardListRequest;
use App\Http\Requests\UpdateBoardListRequest;
use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\JsonResponse;

class BoardListController extends Controller
{
    public function index(Board $board): JsonResponse
    {
        $lists = $board->lists()->with('cards')->get();
        return response()->json($lists);
    }

    public function store(StoreBoardListRequest $request, Board $board): JsonResponse
    {
        $list = $board->lists()->create($request->validated());
        return response()->json($list, 201);
    }

    public function show(BoardList $boardList): JsonResponse
    {
        return response()->json($boardList->load('cards.tags', 'cards.members'));
    }

    public function update(UpdateBoardListRequest $request, BoardList $boardList): JsonResponse
    {
        $boardList->update($request->validated());
        return response()->json($boardList);
    }

    public function destroy(BoardList $boardList): JsonResponse
    {
        $boardList->delete();
        return response()->json(null, 204);
    }
}
