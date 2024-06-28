<?php

namespace Modules\Indicator\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Modules\Indicator\Entities\Indicator;
use Modules\Goal\Entities\Goal;
use Modules\Record\Entities\Record;
use App\Http\Controllers\Controller;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Http\Request;

class IndicatorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            // Carregar todos os indicadores com os relacionamentos de serviços e atividades
            $indicators = Indicator::with(['serviceActivityIndicators.service', 'serviceActivityIndicators.activity'])
            ->get()
                ->map(function ($indicator) {
                    // Organizar os dados para incluir serviços e atividades associadas
                    $services = $indicator->serviceActivityIndicators->map(function ($sai) {
                        return [
                            'id' => $sai->service->id,
                            'name' => $sai->service->service_name
                        ];
                    })->unique('id')->values();

                    $activities = $indicator->serviceActivityIndicators->map(function ($sai) {
                        return [
                            'id' => $sai->activity->id,
                            'name' => $sai->activity->activity_name
                        ];
                    })->unique('id')->values();

                    return [
                        'id' => $indicator->id,
                        'name' => $indicator->indicator_name,
                        'services' => $services,
                        'activities' => $activities
                    ];
                });

            return response()->json(['data' => $indicators], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getIndicatorsPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size');
            $pageIndex = $request->input('page');

            $indicators = Indicator::query()
                ->orderBy('created_at', 'desc')
                ->paginate($pageSize, ['*'], 'page', $pageIndex);

            return response()->json($indicators, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getSAIPaginated(Request $request){


    }

    public function getAllinDataGraphs(Request $request){
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



    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // Create the indicator
            $indicator = Indicator::create(['indicator_name' => $request->indicator_name]);

            // Iterate through the service IDs and activity IDs to create SAIs
            foreach ($request->service_activity_indicators as $saiRequest) {
                foreach ($request->service_ids as $serviceId) {
                    foreach ($request->activity_ids as $activityId) {
                        // Create the ServiceActivityIndicator
                        $sai = ServiceActivityIndicator::create([
                            'service_id' => $serviceId,
                            'activity_id' => $activityId,
                            'indicator_id' => $indicator->id,
                            'type' => $saiRequest['type']
                        ]);

                        // Create the associated goals
                        foreach ($saiRequest['goals'] as $goalRequest) {
                            Goal::create([
                                'service_activity_indicator_id' => $sai->id,
                                'target_value' => $goalRequest['target_value'],
                                'year' => $goalRequest['year']
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return response()->json($indicator->load('serviceActivityIndicators'), 201);
        } catch (Exception $exception) {
            DB::rollBack();
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
        $indicator = Indicator::with(['serviceActivityIndicators.service', 'serviceActivityIndicators.activity', 'serviceActivityIndicators.goals', 'serviceActivityIndicators.records'])
        ->findOrFail($id);

        return response()->json($indicator);
    }


    /**
     * Display the specified resource.
     *
     * @param  Indicator  $indicator
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Indicator $indicator)
    {
        DB::beginTransaction();
        try {
            // Update the indicator
            $indicator->update(['indicator_name' => $request->indicator_name]);

            // Iterate through the service IDs and activity IDs to create or update SAIs
            foreach ($request->service_activity_indicators as $saiRequest) {
                foreach ($request->service_ids as $serviceId) {
                    foreach ($request->activity_ids as $activityId) {
                        // Update or create the ServiceActivityIndicator
                        $sai = ServiceActivityIndicator::updateOrCreate(
                            [
                                'service_id' => $serviceId,
                                'activity_id' => $activityId,
                                'indicator_id' => $indicator->id,
                            ],
                            [
                                'type' => $saiRequest['type']
                            ]
                        );

                        // Update or create the associated goals
                        foreach ($saiRequest['goals'] as $goalRequest) {
                            Goal::updateOrCreate(
                                [
                                    'service_activity_indicator_id' => $sai->id,
                                    'year' => $goalRequest['year']
                                ],
                                [
                                    'target_value' => $goalRequest['target_value']
                                ]
                            );
                        }
                    }
                }
            }

            DB::commit();
            return response()->json($indicator->load('serviceActivityIndicators'), 200);
        } catch (Exception $exception) {
            DB::rollBack();
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
        DB::beginTransaction();
        try {
            // Encontrar o indicador pelo ID
            $indicator = Indicator::findOrFail($id);

            // Deletar os registros relacionados em service_activity_indicators e suas metas
            $serviceActivityIndicators = $indicator->serviceActivityIndicators;
            foreach ($serviceActivityIndicators as $serviceActivityIndicator) {
                // Deletar as metas relacionadas
                Goal::where('service_activity_indicator_id', $serviceActivityIndicator->id)->delete();
                // Deletar os registros relacionados
                Record::where('service_activity_indicator_id', $serviceActivityIndicator->id)->delete();
                // Deletar o service_activity_indicator
                $serviceActivityIndicator->delete();
            }

            // Deletar o indicador
            $indicator->delete();

            DB::commit();
            return response()->json(['message' => 'Indicator and related records deleted successfully'], 200);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Search for indica$indicator based on a keyword.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('q');
            $indicators = Indicator::where('indicator_name', 'LIKE', '%' . $query . '%')
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($indicators, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
