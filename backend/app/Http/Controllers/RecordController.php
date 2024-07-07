<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Record;
use Illuminate\Support\Facades\Validator;
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
            $this->invalidateCache($record->sai->service_id, $record->sai->activity_id, $record->sai->indicator_id);
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
            $record = Record::create($request->all());
            $this->invalidateCache($record->sai->service_id, $record->sai->activity_id, $record->sai->indicator_id);
            return response()->json($record, 201);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    private function invalidateCache($serviceId, $activityId, $indicatorId)
    {
        $years = range(date('Y') - 5, date('Y'));
        $months = range(1, 12);

        foreach ($years as $year) {
            foreach ($months as $month) {
                Cache::forget("records_mensal_{$serviceId}_{$activityId}_{$indicatorId}_{$year}");
                Cache::forget("records_anual_{$serviceId}_{$activityId}_{$indicatorId}_{$year}");
                Cache::forget("variations_{$serviceId}_{$activityId}_{$indicatorId}_{$year}_{$month}");
            }
        }
        Cache::forget("last_five_years_{$serviceId}_{$activityId}_{$indicatorId}");
        Cache::forget("previous_year_total_{$serviceId}_{$activityId}_{$indicatorId}");
        Cache::forget("current_year_total_{$serviceId}_{$activityId}_{$indicatorId}");
    }
}