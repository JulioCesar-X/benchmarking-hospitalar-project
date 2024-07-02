<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Indicator;
use App\Sai;
use App\Goal;
use App\Record;
use Exception;
use Illuminate\Support\Facades\DB;


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
            $indicators = Indicator::with(['sais.service', 'sais.activity'])
            ->get()
                ->map(function ($indicator) {
                    // Organizar os dados para incluir serviços e atividades associadas
                    $services = $indicator->sais->map(function ($sai) {
                        return [
                            'id' => $sai->service->id,
                            'name' => $sai->service->service_name
                        ];
                    })->unique('id')->values();

                    $activities = $indicator->sais->map(function ($sai) {
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

    public function getSAIPaginated(Request $request)
    {
    }

    public function getAllinDataGraphs(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');
            $month = $request->input('month');

            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;

            // Dados mensais do ano atual
            $recordsMensal = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->whereYear('data', $year)
                ->pluck('valor_mensal');

            // Dados anuais acumulados do ano atual
            $recordsAnual = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->where('year', $year)
                ->pluck('valor_acumulado_agregado');

            // Dados anuais acumulados do ano anterior
            $recordsAnualLastYear = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->where('year', $year - 1)
                ->pluck('valor_acumulado_agregado');

            // Metas mensais acumuladas até o mês atual
            $goalsMensal = DB::table('vw_goals_monthly')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->where('year', $year)
                ->pluck('valor_acumulado_mensal');

            // Meta anual total
            $goalAnual = Sai::with(['goals' => function ($query) use ($year) {
                $query->where('year', $year);
            }])
                ->find($saiId)
                ->goals
                ->first()
                ->target_value;

            // Dados dos últimos cinco anos
            $lastFiveYears = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->groupBy('year')
                ->orderBy('year', 'desc')
                ->limit(5)
                ->select('year', DB::raw('SUM(valor_acumulado_agregado) as total'))
                ->get();

            // Totais acumulados do ano anterior
            $previousYearTotal = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->whereYear('data', $year - 1)
                ->sum('valor_acumulado_agregado');

            // Totais acumulados do ano atual
            $currentYearTotal = DB::table('vw_indicator_accumulated')
            ->where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->whereYear('data', $year)
                ->sum('valor_acumulado_agregado');

            // Formatando a resposta JSON
            $response = [
                'saiID' => $saiId,
                'years' => $lastFiveYears->pluck('year')->toArray(),
                'recordsMensal' => $recordsMensal->toArray(),
                'recordsAnual' => $recordsAnual->toArray(),
                'recordsAnualLastYear' => $recordsAnualLastYear->toArray(),
                'goalsMensal' => $goalsMensal->toArray(),
                'goalAnual' => $goalAnual,
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
        $serviceId = $request->input('serviceId');
        $activityId = $request->input('activityId');
        $year = $request->input('year');
        $month = $request->input('month');
        $page = $request->input('page', 1);
        $size = $request->input('size', 10);

        try {
            // Consulta principal para buscar registros
            $query = Sai::with(['indicator', 'records' => function ($query) use ($year, $month) {
                $query->whereYear('date', $year)
                    ->whereMonth('date', $month);
            }])
                ->where('service_id', $serviceId);

            if (!is_null($activityId) && $activityId !== '') {
                $query->where('activity_id', $activityId);
            }

            $total = $query->count();
            $records = $query->skip(($page - 1) * $size)->take($size)->get();

            $response = [
                'total' => $total,
                'data' => $records->map(function ($sai) {
                    return [
                        'sai_id' => $sai->id,
                        'indicator_name' => $sai->indicator->indicator_name,
                        'records' => $sai->records->map(function ($record) {
                            return [
                                'record_id' => $record->id,
                                'value' => $record->value,
                                'date' => $record->date
                            ];
                        })->toArray()
                    ];
                })->toArray()
            ];

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
        $serviceId = $request->input('serviceId');
        $activityId = $request->input('activityId');
        $year = $request->input('year');
        $page = $request->input('page', 1);
        $size = $request->input('size', 10);

        try {
            // Paginação dos resultados
            $query = Sai::with([
                'indicator',
                'goals' => function ($query) use ($year) {
                    $query->where('year', '=', $year);
                },
                'service',
                'activity'
            ])->where('service_id', $serviceId);

            // Verifica se o activityId é nulo ou vazio
            if ($activityId !== null && $activityId !== '') {
                $query->where('activity_id', $activityId);
            }

            $total = $query->count();

            $sais = $query->skip(($page - 1) * $size)
                ->take($size)
                ->get();

            // Formatação da resposta para enviar dados já estruturados
            $response = $sais->map(function ($sai) {
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

            return response()->json([
                'total' => $total,
                'page' => $page,
                'size' => $size,
                'data' => $response
            ]);
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
                        $sai = Sai::create([
                            'service_id' => $serviceId,
                            'activity_id' => $activityId,
                            'indicator_id' => $indicator->id,
                            'type' => $saiRequest['type']
                        ]);

                        // Create the associated goals
                        foreach ($saiRequest['goals'] as $goalRequest) {
                            Goal::create([
                                'sai_id' => $sai->id,
                                'target_value' => $goalRequest['target_value'],
                                'year' => $goalRequest['year']
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return response()->json($indicator->load('sais'), 201);
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
        $indicator = Indicator::with(['sais.service', 'sais.activity', 'sais.goals', 'sais.records'])
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
                        $sai = Sai::updateOrCreate(
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
                                    'sai_id' => $sai->id,
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
            return response()->json($indicator->load('sais'), 200);
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
            $sais = $indicator->sais;
            foreach ($sais as $serviceActivityIndicator) {
                // Deletar as metas relacionadas
                Goal::where('sai_id', $serviceActivityIndicator->id)->delete();
                // Deletar os registros relacionados
                Record::where('sai_id', $serviceActivityIndicator->id)->delete();
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
