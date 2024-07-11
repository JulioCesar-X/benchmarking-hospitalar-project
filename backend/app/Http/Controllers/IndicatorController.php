<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Indicator;
use App\Sai;
use App\Goal;
use App\Record;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;




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

            $cacheKey = 'indicators_index';
            // Verifica se o cache já possui os dados
            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }
            // Carrega indicadores com os relacionamentos sais, service, e activity
            $indicators = Indicator::with(['sais' => function ($query) {
                $query->select('id', 'service_id', 'activity_id', 'indicator_id');
            }, 'sais.service:id,service_name', 'sais.activity:id,activity_name'])
                ->select('id', 'indicator_name')
                ->get();

            if ($indicators->isEmpty()) {
                return response()->json([], 200);
            }
            // Transforma os indicadores carregados
            $indicators = $indicators->map(function ($indicator) {
                $services = $indicator->sais->map(function ($sai) {
                    return $sai->service ? [
                        'id' => $sai->service->id,
                        'name' => $sai->service->service_name
                    ] : null;
                })->filter()->unique('id')->values();

                $activities = $indicator->sais->map(function ($sai) {
                    return $sai->activity ? [
                        'id' => $sai->activity->id,
                        'name' => $sai->activity->activity_name
                    ] : null;
                })->filter()->unique('id')->values();

                return [
                    'id' => $indicator->id,
                    'indicator_name' => $indicator->indicator_name,
                    'services' => $services,
                    'activities' => $activities
                ];
            });
            // Armazena os dados no cache por 30 minutos
            Cache::put($cacheKey, $indicators, now()->addMinutes(30));

            return response()->json($indicators, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching indicators:', ['exception' => $exception]);
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getIndicatorsPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size', 15);
            $pageIndex = $request->input('page', 1);
            $indicators = Indicator::orderBy('created_at', 'desc')
                ->paginate($pageSize, ['*'], 'page', $pageIndex);
            return response()->json($indicators, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getRecordsMensal(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "records_mensal_{$saiId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $recordsMensal = DB::table('vw_indicator_accumulated')
            ->where('sai_id', $saiId)
                ->whereYear('data', $year)
                ->pluck('valor_mensal')
                ->toArray();

            Cache::put($cacheKey, $recordsMensal, now()->addMinutes(30));

            return response()->json($recordsMensal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getRecordsAnual(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "records_anual_{$saiId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $recordsAnual = DB::table('vw_indicator_accumulated')
            ->where('sai_id', $saiId)
                ->where('year', $year)
                ->pluck('valor_acumulado_agregado')
                ->toArray();

            Cache::put($cacheKey, $recordsAnual, now()->addMinutes(30));

            return response()->json($recordsAnual, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getRecordsLastYear(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year') - 1;

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "records_anual_last_year_{$saiId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $recordsAnualLastYear = DB::table('vw_indicator_accumulated')
            ->where('sai_id', $saiId)
                ->where('year', $year)
                ->pluck('valor_acumulado_agregado')
                ->toArray();

            Cache::put($cacheKey, $recordsAnualLastYear, now()->addMinutes(30));

            return response()->json($recordsAnualLastYear, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getGoalMes(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "goal_mes_{$saiId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $goalMes = DB::table('vw_goals_monthly')
            ->where('sai_id', $saiId)
                ->where('year', $year)
                ->pluck('monthly_target')
                ->map(function ($value) {
                    return round($value);
                })
                ->toArray();

            Cache::put($cacheKey, $goalMes, now()->addMinutes(30));

            return response()->json($goalMes, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getGoalsMensal(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "goals_mensal_{$saiId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $goalsMensal = DB::table('vw_goals_monthly')
            ->where('sai_id', $saiId)
                ->where('year', $year)
                ->pluck('valor_acumulado_mensal')
                ->map(function ($value) {
                    return round($value);
                })
                ->toArray();

            Cache::put($cacheKey, $goalsMensal, now()->addMinutes(30));

            return response()->json($goalsMensal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getGoalAnual(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');

            $cacheKey = "goal_anual_{$serviceId}_{$activityId}_{$indicatorId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $goalAnual = $sai->goals()->where('year', $year)->first()->target_value;

            Cache::put($cacheKey, $goalAnual, now()->addMinutes(30));

            return response()->json($goalAnual, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getPreviousYearTotal(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year') - 1;

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "previous_year_total_{$saiId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $previousYearTotal = DB::table('vw_indicator_accumulated')
            ->where('sai_id', $saiId)
                ->whereYear('data', $year)
                ->sum('valor_mensal');

            Cache::put($cacheKey, $previousYearTotal, now()->addMinutes(30));

            return response()->json($previousYearTotal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getCurrentYearTotal(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "current_year_total_{$saiId}_{$year}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $currentYearTotal = DB::table('vw_indicator_accumulated')
            ->where('sai_id', $saiId)
                ->whereYear('data', $year)
                ->sum('valor_mensal');

            Cache::put($cacheKey, $currentYearTotal, now()->addMinutes(30));

            return response()->json($currentYearTotal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getVariations(Request $request)
    {
        try {
            $serviceId = $request->input('serviceId');
            $activityId = $request->input('activityId');
            $indicatorId = $request->input('indicatorId');
            $year = $request->input('year');
            $month = $request->input('month');

            // Buscar o sai_id baseado nos parâmetros fornecidos
            $sai = Sai::where('service_id', $serviceId)
                ->where('activity_id', $activityId)
                ->where('indicator_id', $indicatorId)
                ->first();

            if (!$sai) {
                return response()->json(['error' => 'Service Activity Indicator not found'], 404);
            }

            $saiId = $sai->id;
            $cacheKey = "variations_{$saiId}_{$year}_{$month}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $variations = DB::table('vw_variation_rate')
            ->where('sai_id', $saiId)
                ->where('year1', $year - 1)
                ->where('year2', $year)
                ->where('month', $month)
                ->first([
                    'variation_rate_homologous_abs',
                    'variation_rate_homologous',
                    'variation_rate_contractual_abs',
                    'variation_rate_contractual'
                ]);

            if ($variations) {
                $variations->variation_rate_homologous_abs = round($variations->variation_rate_homologous_abs);
                $variations->variation_rate_homologous = round($variations->variation_rate_homologous);
                $variations->variation_rate_contractual_abs = round($variations->variation_rate_contractual_abs);
            }

            Cache::put($cacheKey, $variations, now()->addMinutes(30));

            return response()->json($variations, 200);
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
            $query = Sai::with(['indicator:id,indicator_name', 'records' => function ($query) use ($year, $month) {
                $query->select('id', 'sai_id', 'value', 'date')
                    ->whereYear('date', $year)
                    ->whereMonth('date', $month);
            }])->where('service_id', $serviceId);

            if (!is_null($activityId) && $activityId !== '') {
                $query->where('activity_id', $activityId);
            }

            $total = $query->count();
            $records = $query->skip(($page - 1) * $size)->take($size)->get(['id', 'indicator_id']);

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
                        })
                    ];
                })
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
            $query = Sai::with([
                'indicator:id,indicator_name',
                'goals' => function ($query) use ($year) {
                    $query->select('id', 'sai_id', 'target_value', 'year')
                        ->where('year', $year);
                },
                'service:id,service_name',
                'activity:id,activity_name'
            ])->where('service_id', $serviceId);

            if ($activityId !== null && $activityId !== '') {
                $query->where('activity_id', $activityId);
            }

            $total = $query->count();
            $sais = $query->skip(($page - 1) * $size)->take($size)->get(['id', 'indicator_id']);

            $response = $sais->map(function ($sai) {
                return [
                    'sai_id' => $sai->id,
                    'indicator_name' => $sai->indicator->indicator_name,
                    'goal' => $sai->goals->first()
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

            $saiData = [];
            $goalData = [];
            $recordData = [];
            $currentYear = date('Y');

            foreach ($request->sais as $saiRequest) {
                foreach ($request->service_ids as $serviceId) {
                    foreach ($request->activity_ids as $activityId) {
                        // Collect Sai data
                        $sai = [
                            'service_id' => $serviceId,
                            'activity_id' => $activityId,
                            'indicator_id' => $indicator->id,
                            'type' => $saiRequest['type']
                        ];
                        $saiData[] = $sai;

                        // Temporarily store goals and records for later insertion
                        foreach ($saiRequest['goals'] as $goalRequest) {
                            $goalData[] = [
                                'sai_id' => null, // Placeholder, will be replaced later
                                'target_value' => $goalRequest['target_value'],
                                'year' => $goalRequest['year']
                            ];
                        }

                        // for ($i = 1; $i <= 12; $i++) {
                        //     $recordData[] = [
                        //         'sai_id' => null, // Placeholder, will be replaced later
                        //         'value' => 0,
                        //         'date' => "$currentYear-$i-01"
                        //     ];
                        // }
                    }
                }
            }

            // Insert SAIs in bulk and get their IDs
            Sai::insert($saiData);
            $saiIds = Sai::where('indicator_id', $indicator->id)->pluck('id')->toArray();

            // Update goals and records with correct sai_id
            foreach ($saiIds as $index => $saiId) {
                foreach ($goalData as &$goal) {
                    if ($goal['sai_id'] === null) {
                        $goal['sai_id'] = $saiId;
                        break;
                    }
                }

                foreach ($recordData as &$record) {
                    if ($record['sai_id'] === null) {
                        $record['sai_id'] = $saiId;
                        break;
                    }
                }
            }

            // Insert goals and records in bulk
            Goal::insert($goalData);
            Record::insert($recordData);

            DB::commit();

            // Clear the cache
            Cache::forget('indicators_index');

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
        $indicator = Indicator::with(['sais.service', 'sais.activity', 'sais.records'])
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
            // Update the indicator name
            $indicator->update(['indicator_name' => $request->indicator_name]);

            //Sai::where('indicator_id', $indicator->id)->delete();

            $saiData = [];
            foreach ($request->activity_ids as $activityId) {
                foreach ($request->service_ids as $serviceId) {
                    $saiData[] = [
                        'activity_id' => $activityId,
                        'indicator_id' => $indicator->id,
                        'service_id' => $serviceId,
                        'type' => 'default'
                    ];
                }
            }
            
            // Insert new SAIs
            Sai::insert($saiData);

            DB::commit();
            // Clear the cache for the updated data
            Cache::forget('indicators_index');

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

            // Deletar os registros relacionados em sais e suas metas
            $sais = $indicator->sais;
            foreach ($sais as $serviceActivityIndicator) {
                // Deletar as metas relacionadas
                Goal::where('sai_id', $serviceActivityIndicator->id)->delete();
                // Deletar os registros relacionados
                Record::where('sai_id', $serviceActivityIndicator->id)->delete();
                // Deletar o sai
                $serviceActivityIndicator->delete();
            }

            // Deletar o indicador
            $indicator->delete();

            DB::commit();

            // Clear the cache
            Cache::forget('indicators_index');

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
            $query = $request->query('q');
            $indicators = Indicator::whereRaw('LOWER(indicator_name) LIKE ?', ['%' . strtolower($query) . '%'])
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($indicators, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
