<?php

namespace Modules\ServiceActivityIndicator\Http\Controllers;

use Illuminate\Http\Request;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Modules\Goal\Entities\Goal;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
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
        // Validação inicial dos parâmetros de entrada
        $validator = Validator::make($request->all(), [
            'serviceId' => 'required|integer',
            'activityId' => 'required|integer',
            'date' => 'required|date_format:Y-m-d'  // Garante que a data está no formato correto
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Extração dos parâmetros após validação
        $serviceId = $request->input('serviceId');
        $activityId = $request->input('activityId');
        $date = $request->input('date');

        // Parsing da data para extrair o ano e o mês
        $year = Carbon::createFromFormat('Y-m-d', $date)->year;
        $month = Carbon::createFromFormat('Y-m-d', $date)->month;

        try {
            // Consulta principal para buscar indicadores, incluindo pré-carregamento de relações
            $serviceActivityIndicators = ServiceActivityIndicator::with([
                'indicator', // Carrega os detalhes do indicador
                'records' => function ($query) use ($year, $month) {
                    $query->whereYear('date', '=', $year)
                        ->whereMonth('date', '=', $month); // Filtra os registros pelo mês e ano
                },
                'service',
                'activity'
            ])
                ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->get();

            // Formatação da resposta para enviar dados já estruturados
            $response = $serviceActivityIndicators->map(function ($sai) {
                return [
                    'sai_id' => $sai->id,
                    'service_name' => $sai->service->service_name ?? 'No Service',
                    'activity_name' => $sai->activity->activity_name ?? 'No Activity',
                    'indicator_name' => $sai->indicator->indicator_name,
                    'records' => $sai->records->map(function ($record) {
                        // Assegura que a data é um objeto Carbon
                        $date = $record->date instanceof Carbon ? $record->date : Carbon::createFromFormat('Y-m-d', $record->date);
                        return [
                            'record_id' => $record->id,
                            'value' => $record->value,
                            'date' => $date->toDateString()  // Formata a data corretamente
                        ];
                    })
                ];
            });

            return response()->json($response);
        } catch (Exception $exception) {
            Log::error("Error fetching indicators: " . $exception->getMessage());
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
