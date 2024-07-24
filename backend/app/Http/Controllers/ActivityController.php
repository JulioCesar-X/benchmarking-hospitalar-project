<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Sai;
use App\Activity;
use Exception;

class ActivityController extends Controller
{
    public function index()
    {
        try {
            $cacheKey = 'activities_index';

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $activities = Activity::with(['sais.service:id,service_name', 'sais.indicator:id,indicator_name'])
                ->select('id', 'activity_name')
                ->get()
                ->map(function ($activity) {
                    return $this->transformActivity($activity);
                });

            Cache::put($cacheKey, $activities, now()->addMinutes(30));

            return response()->json($activities, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching activities: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getActivitiesPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size', 15);
            $pageIndex = $request->input('page', 1);
            $activities = Activity::orderBy('created_at', 'desc')
                ->paginate($pageSize, ['*'], 'page', $pageIndex);
            return response()->json($activities, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching paginated activities: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $existingActivity = Activity::where('activity_name', $request->activity_name)->first();
            if ($existingActivity) {
                return response()->json(['error' => 'Nome da atividade já existe.'], 400);
            }

            $activity = Activity::create(['activity_name' => $request->activity_name]);

            $saiData = $this->prepareSaiData($activity->id, $request->associations);
            if (!empty($saiData)) {
                Sai::insert($saiData);
            }

            DB::commit();
            Cache::forget('activities_index');

            return response()->json($activity->load('sais'), 201);
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error('Erro ao criar a atividade: ', ['exception' => $exception]);
            return response()->json(['error' => 'Erro interno do servidor'], 500);
        }
    }

    public function show($id)
    {
        try {
            $activity = Activity::with(['sais.service:id,service_name', 'sais.indicator:id,indicator_name'])
                ->select('id', 'activity_name')
                ->findOrFail($id);
            return response()->json($activity, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching activity: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function update(Request $request, Activity $activity)
    {
        DB::beginTransaction();
        try {
            $existingActivity = Activity::where('activity_name', $request->activity_name)
                ->where('id', '<>', $activity->id)
                ->first();
            if ($existingActivity) {
                return response()->json(['error' => 'Nome da atividade já existe.'], 400);
            }

            $activity->update(['activity_name' => $request->activity_name]);

            $this->processDesassociations($request->desassociations);
            $saiData = $this->prepareSaiData($activity->id, $request->associations);
            if (!empty($saiData)) {
                Sai::insert($saiData);
            }

            DB::commit();
            Cache::forget('activities_index');

            return response()->json($activity->load('sais'), 200);
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error('Erro ao atualizar a atividade: ', ['exception' => $exception]);
            return response()->json(['error' => 'Erro interno do servidor'], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $activity = Activity::findOrFail($id);

            $this->deleteActivityAssociations($activity);

            $activity->delete();

            DB::commit();
            Cache::forget('activities_index');

            return response()->json(['message' => 'Atividade deletada com sucesso.'], 200);
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error('Erro ao deletar a atividade: ', ['exception' => $exception]);
            return response()->json(['error' => 'Erro interno do servidor'], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = $request->query('q');
            $cacheKey = "activities_search_{$query}";

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $activities = Activity::whereRaw('LOWER(activity_name) LIKE ?', ['%' . strtolower($query) . '%'])
                ->orderBy('updated_at', 'desc')
                ->get();

            Cache::put($cacheKey, $activities, now()->addMinutes(30));

            return response()->json($activities, 200);
        } catch (Exception $exception) {
            Log::error('Error searching activities: ', ['exception' => $exception]);
            return response()->json(['error' => 'Erro interno do servidor'], 500);
        }
    }

    private function prepareSaiData($activityId, $associations)
    {
        $saiData = [];
        $existingCombinations = [];

        if ($associations) {
            foreach ($associations as $association) {
                $combinationKey = $association['service_id'] . '_' . $association['indicator_id'];

                if (in_array($combinationKey, $existingCombinations)) {
                    throw new Exception('Associação duplicada detectada para service_id: ' . $association['service_id'] . ', indicator_id: ' . $association['indicator_id']);
                }

                $existingSai = Sai::where('activity_id', $activityId)
                    ->where('service_id', $association['service_id'])
                    ->where('indicator_id', $association['indicator_id'])
                    ->first();

                if (!$existingSai) {
                    $saiData[] = [
                        'service_id' => $association['service_id'],
                        'activity_id' => $activityId,
                        'indicator_id' => $association['indicator_id'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }

                $existingCombinations[] = $combinationKey;
            }
        }

        return $saiData;
    }

    private function processDesassociations($desassociations)
    {
        if ($desassociations) {
            foreach ($desassociations as $desassociation) {
                $sai = Sai::find($desassociation['sai_id']);
                if ($sai) {
                    DB::table('goals')->where('sai_id', $sai->id)->delete();
                    DB::table('records')->where('sai_id', $sai->id)->delete();
                    $sai->delete();
                }
            }
        }
    }

    private function deleteActivityAssociations($activity)
    {
        foreach ($activity->sais as $sai) {
            DB::table('goals')->where('sai_id', $sai->id)->delete();
            DB::table('records')->where('sai_id', $sai->id)->delete();
            $sai->delete();
        }
    }

    private function transformActivity($activity)
    {
        $services = $activity->sais->map(function ($sai) {
            return $sai->service ? [
                'id' => $sai->service->id,
                'name' => $sai->service->service_name
            ] : null;
        })->filter()->unique('id')->values();

        $indicators = $activity->sais->map(function ($sai) {
            return $sai->indicator ? [
                'id' => $sai->indicator->id,
                'name' => $sai->indicator->indicator_name
            ] : null;
        })->filter()->unique('id')->values();

        return [
            'id' => $activity->id,
            'activity_name' => $activity->activity_name,
            'services' => $services,
            'indicators' => $indicators
        ];
    }
}