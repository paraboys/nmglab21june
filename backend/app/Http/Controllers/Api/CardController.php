<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCardRequest;
use App\Http\Requests\UpdateCardRequest;
use App\Models\BoardList;
use App\Models\Card;
use Illuminate\Http\JsonResponse;

class CardController extends Controller
{
    public function index(BoardList $boardList): JsonResponse
    {
        $cards = $boardList->cards()->with(['tags', 'members'])->get();
        return response()->json($cards);
    }

    public function store(StoreCardRequest $request, BoardList $boardList): JsonResponse
    {
        $data = $request->validated();
        $data['board_id'] = $boardList->board_id;
        $card = $boardList->cards()->create($data);

        if (!empty($data['tag_ids'])) {
            $card->tags()->sync($data['tag_ids']);
        }
        if (!empty($data['member_ids'])) {
            $card->members()->sync($data['member_ids']);
        }

        return response()->json($card->load(['tags', 'members']), 201);
    }

    public function show(Card $card): JsonResponse
    {
        return response()->json($card->load(['tags', 'members']));
    }

    public function update(UpdateCardRequest $request, Card $card): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['list_id'])) {
            $newList = BoardList::findOrFail($data['list_id']);
            $data['board_id'] = $newList->board_id;
        }

        $card->update($data);

        if (array_key_exists('tag_ids', $data)) {
            $card->tags()->sync($data['tag_ids'] ?? []);
        }
        if (array_key_exists('member_ids', $data)) {
            $card->members()->sync($data['member_ids'] ?? []);
        }

        return response()->json($card->load(['tags', 'members']));
    }

    public function destroy(Card $card): JsonResponse
    {
        $card->delete();
        return response()->json(null, 204);
    }
}
