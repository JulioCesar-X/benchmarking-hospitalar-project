<?php

namespace Modules\ServiceActivityIndicator\Http\Controllers;

use Illuminate\Http\Request;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Modules\Goal\Entities\Goal;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
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
            $sais = ServiceActivityIndicator::with(['service', 'activity'])
            ->get()
                ->groupBy('service_id')
                ->map(function ($group) {
                    return [
                        'service_id' => $group->first()->service_id,
                        'service_name' => $group->first()->service->service_name,
                        'activities' => $group->map(function ($item) {
                            return [
                                'activity_id' => $item->activity_id,
                                'activity_name' => $item->activity->activity_name
                            ];
                        })->unique('activity_id')->values()
                    ];
                })->values();

            return response()->json(['services' => $sais], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getIndicatorsRecords(Request $request)
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
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getIndicatorsGoals(Request $request)
    {
        // Validação dos parâmetros de entrada
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|integer',
            'activity_id' => 'required|integer',
            'year' => 'required|integer|min:1900|max:2100' // Validar o ano
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Extração dos parâmetros após validação
        $serviceId = $request->input('service_id');
        $activityId = $request->input('activity_id');
        $year = $request->input('year');

        try {
            // Consulta principal para buscar indicadores, incluindo pré-carregamento de relações
            $serviceActivityIndicators = ServiceActivityIndicator::with([
                'indicator',
                'goals' => function ($query) use ($year) {
                    $query->where('year', '=', $year);
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
                    'indicator_name' => $sai->indicator->indicator_name,
                    'goal' => $sai->goals->map(function ($goal) {
                        return [
                            'goal_id' => $goal->id,
                            'target_value' => $goal->target_value,
                            'year' => $goal->year
                        ];
                    })->first()
                ];
            });

            return response()->json($response);
        } catch (Exception $exception) {
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

    public function allin(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');
            $month = $request->input('month');

            // Find the ServiceActivityIndicator ID (saiID)
            $sai = ServiceActivityIndicator::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;

            // Aggregate data from vw_indicator_accumulated view
            $recordsMensal = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->whereYear('data', $year)
                ->pluck('valor_mensal');

            $recordsAnual = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->where('year', $year)
                ->pluck('valor_acumulado_agregado');

            // Get goals data from vw_goals_monthly view
            $goalsMensal = DB::table('vw_goals_monthly')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->where('year', $year)
                ->pluck('monthly_target');

            $goalsAnual = DB::table('vw_goals_monthly')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->groupBy('year', 'meta_anual') // Inclui 'meta_anual' no GROUP BY
                ->pluck('meta_anual'); // Use meta_anual instead of Meta_Anual

            // Get data for last five years from vw_indicator_accumulated view
            $lastFiveYears = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->groupBy('year')
                ->orderBy('year', 'desc')
                ->limit(5)
                ->select('year', DB::raw('SUM(valor_acumulado_agregado) as total'))
                ->get();

            // Get homologous year comparison from vw_variation_rate view
            $previousYearTotal = DB::table('vw_variation_rate')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->where('year1', $year - 1)
                ->where('month', $month)
                ->value('total_accumulated_year1');

            $currentYearTotal = DB::table('vw_variation_rate')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->where('year2', $year)
                ->where('month', $month)
                ->value('total_accumulated_year2');

            // Format the response JSON
            $response = [
                'saiID' => $saiId,
                'years' => $lastFiveYears->pluck('year')->toArray(),
                'recordsMensal' => $recordsMensal->toArray(),
                'recordsAnual' => $recordsAnual->toArray(),
                'goalsMensal' => $goalsMensal->toArray(),
                'goalsAnual' => $goalsAnual->toArray(),
                'lastFiveYears' => $lastFiveYears->toArray(),
                'previousYearTotal' => $previousYearTotal,
                'currentYearTotal' => $currentYearTotal,
            ];

            return response()->json($response, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }



}
