<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Goal;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Cache;

class GoalController extends Controller
{
    public function update(Request $request, Goal $goal)
    {
        $validator = Validator::make($request->all(), [
            'target_value' => 'required|numeric',
            'year' => 'required|integer|min:1900|max:2100'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $goal->update($request->all());
            $this->invalidateCache($goal->sai->service_id, $goal->sai->activity_id, $goal->sai->indicator_id);
            return response()->json($goal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'target_value' => 'required|numeric',
            'year' => 'required|integer|min:1900|max:2100',
            'sai_id' => 'required|exists:sais,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $goal = Goal::create($request->all());
            $this->invalidateCache($goal->sai->service_id, $goal->sai->activity_id, $goal->sai->indicator_id);
            return response()->json($goal, 201);
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
                Cache::forget("records_last_year_{$serviceId}_{$activityId}_{$indicatorId}");
                Cache::forget("goals_mensal_{$serviceId}_{$activityId}_{$indicatorId}_{$year}");
                Cache::forget("goal_anual_{$serviceId}_{$activityId}_{$indicatorId}_{$year}");
                Cache::forget("variations_{$serviceId}_{$activityId}_{$indicatorId}_{$year}_{$month}");
            }
        }
        Cache::forget("last_five_years_{$serviceId}_{$activityId}_{$indicatorId}");
        Cache::forget("previous_year_total_{$serviceId}_{$activityId}_{$indicatorId}");
        Cache::forget("current_year_total_{$serviceId}_{$activityId}_{$indicatorId}");
    }
}