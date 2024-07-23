<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Record;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\UpdateDataMail;
use App\User;
use Exception;
use Illuminate\Support\Facades\Cache;

class RecordController extends Controller
{
    public function update(Request $request, Record $record)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required|numeric',
            'date' => 'required|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $record->update($request->all());

            $this->notifyRootIfNotNotified();

            return response()->json($record, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required|numeric',
            'date' => 'required|date_format:Y-m-d',
            'sai_id' => 'required|exists:sais,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            // Verifica se já existe um registro para a mesma data e sai_id
            $existingRecord = Record::where('sai_id', $request->sai_id)
                ->where('date', $request->date)
                ->first();

            if ($existingRecord) {
                return response()->json(['error' => 'Record already exists for this date'], 409);
            }

            $record = Record::create($request->all());

            $this->notifyRootIfNotNotified();

            return response()->json($record, 201);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
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