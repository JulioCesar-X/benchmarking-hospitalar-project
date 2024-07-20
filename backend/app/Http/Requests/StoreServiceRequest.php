<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Ajuste conforme necessário
    }

    public function rules()
    {
        return [
            'service_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'more_info' => 'nullable|string',
            'activity_ids' => 'required|array',
            'activity_ids.*' => 'exists:activities,id',
            'indicator_ids' => 'required|array',
            'indicator_ids.*' => 'exists:indicators,id'
        ];
    }
}
