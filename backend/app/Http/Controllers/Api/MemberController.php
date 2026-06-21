<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use Illuminate\Http\JsonResponse;

class MemberController extends Controller
{
    public function index(): JsonResponse
    {
        $members = Member::latest()->get();
        return response()->json($members);
    }

    public function store(StoreMemberRequest $request): JsonResponse
    {
        $member = Member::create($request->validated());
        return response()->json($member, 201);
    }

    public function show(Member $member): JsonResponse
    {
        return response()->json($member);
    }

    public function update(UpdateMemberRequest $request, Member $member): JsonResponse
    {
        $member->update($request->validated());
        return response()->json($member);
    }

    public function destroy(Member $member): JsonResponse
    {
        $member->delete();
        return response()->json(null, 204);
    }
}
