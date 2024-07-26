<?php

namespace App\Http\Controllers;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Mail\UpdateDataMail;
use App\Record;
use App\User;
use Exception;

class RecordController extends Controller
{
    public function update(Request $request, Record $record)
    {
        $validator = $this->validateRecord($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $record->update($request->all());

            $this->notifyRootIfNotNotified();
            Cache::forget("record_{$record->id}");

            return response()->json($record, 200);
        } catch (Exception $exception) {
            Log::error('Error updating record: ', ['exception' => $exception]);
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = $this->validateRecord($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $existingRecord = Record::where('sai_id', $request->sai_id)
                ->where('date', $request->date)
                ->first();

            if ($existingRecord) {
                return response()->json(['error' => 'Record already exists for this date'], 409);
            }

            $record = Record::create($request->all());

            $this->notifyRootIfNotNotified();
            Cache::forget("record_{$record->id}");

            return response()->json($record, 201);
        } catch (Exception $exception) {
            Log::error('Error storing record: ', ['exception' => $exception]);
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    private function validateRecord($request)
    {
        return Validator::make($request->all(), [
            'value' => 'required|numeric',
            'date' => 'required|date_format:Y-m-d',
            'sai_id' => 'required|exists:sais,id'
        ]);
    }

    private function notifyRootIfNotNotified()
    {
        $date = now()->format('Y-m-d');
        $cacheKey = "root_notified_{$date}";

        if (!Cache::has($cacheKey)) {
            $root = User::whereHas('roles', function ($query) {
                $query->where('role_name', 'Root');
            })->first();

            if ($root) {
                Mail::to($root->email)->send(new UpdateDataMail());
                Cache::put($cacheKey, true, now()->endOfDay());
            }
        }
    }
}