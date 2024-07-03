<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Goal;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Cache;


class GoalController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Goal $goal)
    {
        // Validação dos parâmetros de entrada
        $validator = Validator::make($request->all(), [
            'target_value' => 'required|string',
            'year' => 'required|integer|min:1900|max:2100'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            // Atualização da meta
            $goal->update($request->all());

            // Invalida o cache após a atualização
            $this->invalidateCache($goal->service_id, $goal->activity_id, $goal->indicator_id);

            return response()->json($goal, 200);
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
                $cacheKey = "graph_data_{$serviceId}_{$activityId}_{$indicatorId}_{$year}_{$month}";
                Cache::forget($cacheKey);
            }
        }
    }
}