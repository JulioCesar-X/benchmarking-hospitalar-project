<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Record;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Cache;

class RecordController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Record $record
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Record $record)
    {
        try {
            $record->update($request->all());

            // Invalida o cache após a atualização
            $this->invalidateCache($record->sai->service_id, $record->sai->activity_id, $record->sai->indicator_id);

            return response()->json($record, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validação dos parâmetros de entrada
        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'date' => 'required|date_format:Y-m-d',
            'sai_id' => 'required|exists:sais,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            // Criação do novo registro
            $record = Record::create($request->all());

            // Invalida o cache após a criação
            $this->invalidateCache($record->sai->service_id, $record->sai->activity_id, $record->sai->indicator_id);

            return response()->json($record, 201);
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