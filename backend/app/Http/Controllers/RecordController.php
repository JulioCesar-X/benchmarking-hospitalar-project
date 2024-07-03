<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Record;
use Exception;
use Illuminate\Support\Facades\Cache;


class RecordController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Record $record)
    {
        try {
            $record->update($request->all());

            // Invalida o cache após a atualização
            $this->invalidateCache($record->service_id, $record->activity_id, $record->indicator_id);

            return response()->json($record, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    private function invalidateCache($serviceId, $activityId, $indicatorId)
    {
        $years = range(date('Y') - 5, date('Y')); // Invalida cache dos últimos 5 anos incluindo o ano atual
        $months = range(1, 12); // Invalida cache de todos os meses

        foreach ($years as $year) {
            foreach ($months as $month) {
                $cacheKey = "graph_data_{$serviceId}_{$activityId}_{$indicatorId}_{$year}_{$month}";
                Cache::forget($cacheKey);
            }
        }
    }
}