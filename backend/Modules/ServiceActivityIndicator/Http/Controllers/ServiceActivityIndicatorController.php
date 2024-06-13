<?php

namespace Modules\ServiceActivityIndicator\Http\Controllers;

use Illuminate\Http\Request;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Modules\Goal\Entities\Goal;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Modules\Record\Entities\Record;
use Exception;


class ServiceActivityIndicatorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $serviceActivityIndicators = ServiceActivityIndicator::with(['service', 'indicator', 'activity'])->get();
            return response()->json($serviceActivityIndicators, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getIndicators(Request $request)
    {
         // Validação dos parâmetros recebidos na requisição
        $validator = Validator::make($request->all(), [
            'indicator_id' => 'nullable|integer',
            'service_id' => 'nullable|integer',
            'activity_id' => 'nullable|integer',
            'date' => 'nullable|date_format:Y-m-d'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        try {
             // Recuperação dos parâmetros
            $serviceId = $request->query('service_id');
            $activityId = $request->query('activity_id');
            $date = $request->query('date');
    
             // Construção da consulta utilizando os relacionamentos Eloquent
            $query = ServiceActivityIndicator::with(['indicator', 'records'])
                ->when($serviceId, function($query, $serviceId) {
                    return $query->where('service_id', $serviceId);
                })
                ->when($activityId, function($query, $activityId) {
                    return $query->where('activity_id', $activityId);
                })
                ->when($date, function($query, $date) {
                    return $query->whereHas('records', function($query) use ($date) {
                        $query->whereDate('date', $date);
                    });
                });
    
             // Execução da consulta
            $serviceActivityIndicators = $query->get();
    
             // Transformação dos resultados para o formato desejado
            $results = $serviceActivityIndicators->map(function($sai) {
                return $sai->records->map(function($record) use ($sai) {
                    return [
                        'sai_id' => $sai->id,
                        'indicator_name' => $sai->indicator->indicator_name,
                        'value' => $record->value,
                        'date' => $record->date,
                    ];
                });
            })->flatten();
    
             // Retorno dos resultados em formato JSON
            return response()->json($results, 200);
        } catch (Exception $exception) {
             // Log e retorno de erro em caso de exceção
            Log::error("Error fetching indicators: " . $exception->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
            return response()->json(['error' => 'Internal Server Error'], 500);
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
        try {
            // Validação dos dados do request
            $validatedData = $request->validate([
                'indicator_id' => 'required|exists:indicators,id',
                'service_id' => 'required|exists:services,id',
                'activity_id' => 'required|exists:activities,id',
                'type' => 'required|string|max:255',
                'target_value' => 'required|integer',
                'year' => 'required|integer',
            ]);

            // Criar a ligação em service_activity_indicators
            $serviceActivityIndicator = ServiceActivityIndicator::create([
                'service_id' => $validatedData['service_id'],
                'activity_id' => $validatedData['activity_id'],
                'indicator_id' => $validatedData['indicator_id'],
                'type' => $validatedData['type']
            ]);

            // Criar o Goal associado
            $goal = Goal::create([
                'service_activity_indicator_id' => $serviceActivityIndicator->id,
                'target_value' => $validatedData['target_value'],
                'year' => $validatedData['year']
            ]);

            return response()->json($serviceActivityIndicator->load('service', 'indicator', 'activity', 'goals'), 201);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $sai = ServiceActivityIndicator::findOrFail($id);
            return response()->json($sai->load(['service', 'indicator', 'activity']), 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ServiceActivityIndicator $sai)
    {
        try {
            $sai->update($request->all());
            return response()->json($sai, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $sai = ServiceActivityIndicator::findOrFail($id);
            $sai->delete();
            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
