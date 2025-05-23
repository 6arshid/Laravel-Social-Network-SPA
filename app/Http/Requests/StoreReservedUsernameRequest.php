<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservedUsernameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // optionally restrict to admin
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:4', 'max:255', 'unique:username_unregister,username'],
        ];
    }
}
