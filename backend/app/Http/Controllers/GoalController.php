<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Goal;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Cache;

class GoalController extends Controller
{
    // Método para atualizar uma meta
    public function update(Request $request, Goal $goal)
    {
        $validator = Validator::make($request->all(), [
            'target_value' => 'required|string',
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

    // Método para criar uma nova meta
    public function store(Request $request)
    {
        // Validação dos parâmetros de entrada
        $validator = Validator::make($request->all(), [
            'target_value' => 'required',
            'year' => 'required|integer|min:1900|max:2100',
            'sai_id' => 'required|exists:sais,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            // Criação da nova meta
            $goal = Goal::create($request->all());

            // Invalida o cache após a criação
            $this->invalidateCache($goal->sai->service_id, $goal->sai->activity_id, $goal->sai->indicator_id);

            return response()->json($goal, 201);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // Método para invalidar o cache
    private function invalidateCache($serviceId, $activityId, $indicatorId)
    {
        $years = range(date('Y') - 5, date('Y'));
        $months = range(1, 12);

        foreach ($years as $year) {
            foreach ($months as $month) {
                $cacheKey = "graph_data_{$serviceId}_{$activityId}_{$indicatorId}_{$year}_{$month}";
                Cache::forget($cacheKey);
            }
        }
    }
}