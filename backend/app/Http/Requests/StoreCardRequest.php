<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'list_id' => 'required|exists:board_lists,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'position' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:members,id',
        ];
    }
}
