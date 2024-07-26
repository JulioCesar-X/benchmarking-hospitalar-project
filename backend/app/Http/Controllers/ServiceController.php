<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Service;
use App\Sai;
use Exception;

class ServiceController extends Controller
{
    public function index()
    {
        try {
            $cacheKey = 'services_index';

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $services = Service::with([
                'sais' => function ($query) {
                    $query->select('id', 'activity_id', 'indicator_id', 'service_id');
                },
                'sais.activity:id,activity_name',
                'sais.indicator:id,indicator_name'
            ])
                ->select('id', 'service_name', 'image_url')
                ->get();

            if ($services->isEmpty()) {
                return response()->json([], 200);
            }

            $services = $services->map(function ($service) {
                $activities = $service->sais->map(function ($sai) {
                    return $sai->activity ? [
                        'id' => $sai->activity->id,
                        'name' => $sai->activity->activity_name
                    ] : null;
                })->filter()->unique('id')->values();

                $indicators = $service->sais->map(function ($sai) {
                    return $sai->indicator ? [
                        'id' => $sai->indicator->id,
                        'name' => $sai->indicator->indicator_name
                    ] : null;
                })->filter()->unique('id')->values();

                return [
                    'id' => $service->id,
                    'service_name' => $service->service_name,
                    'image_url' => $service->image_url,
                    'activities' => $activities,
                    'indicators' => $indicators
                ];
            });

            Cache::put($cacheKey, $services, now()->addMinutes(30));

            return response()->json($services, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching services: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getFirstValidService()
    {
        try {
            $service = Service::orderBy('order', 'asc')->first();
            return response()->json($service, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching first valid service: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getServicesPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size', 15);
            $pageIndex = $request->input('page', 1);

            $services = Service::orderBy('order', 'asc')
                ->paginate($pageSize, ['*'], 'page', $pageIndex);

            return response()->json($services, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching paginated services: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function updateOrder(Request $request)
    {
        try {
            $services = $request->input('services');

            foreach ($services as $index => $service) {
                Service::where('id', $service['id'])->update(['order' => $index]);
            }

            return response()->json(['message' => 'Ordem dos serviços atualizada com sucesso.'], 200);
        } catch (Exception $exception) {
            Log::error('Error updating service order: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $existingService = Service::where('service_name', $request->service_name)->first();
            if ($existingService) {
                return response()->json(['error' => 'Nome do serviço já existe.'], 400);
            }

            $service = Service::create($request->only(['service_name', 'description', 'image_url', 'more_info']));

            $saiData = $this->prepareSaiData($service->id, $request->associations);
            if (!empty($saiData)) {
                Sai::insert($saiData);
            }

            DB::commit();
            Cache::forget('services_index');

            return response()->json($service->load('sais.activity:id,activity_name', 'sais.indicator:id,indicator_name'), 201);
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error('Erro ao criar o serviço: ', ['exception' => $exception]);
            return response()->json(['error' => 'Erro interno do servidor'], 500);
        }
    }

    public function show($id)
    {
        try {
            $service = Service::with(['sais.activity:id,activity_name', 'sais.indicator:id,indicator_name'])
                ->select('id', 'service_name', 'description', 'image_url', 'more_info')
                ->findOrFail($id);
            return response()->json($service, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        DB::beginTransaction();
        try {
            $service = Service::find($request->id);
            if (!$service) {
                return response()->json(['error' => 'Serviço não encontrado.'], 404);
            }

            $existingService = Service::where('service_name', $request->service_name)
                ->where('id', '<>', $service->id)
                ->first();
            if ($existingService) {
                return response()->json(['error' => 'Nome do serviço já existe.'], 400);
            }

            $service->update($request->only(['service_name', 'description', 'image_url', 'more_info']));

            $this->processDesassociations($request->desassociations);
            $saiData = $this->prepareSaiData($service->id, $request->associations);
            if (!empty($saiData)) {
                Sai::insert($saiData);
            }

            DB::commit();
            Cache::forget('services_index');

            return response()->json($service->load('sais.activity:id,activity_name', 'sais.indicator:id,indicator_name'), 200);
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error('Erro ao atualizar o serviço: ', ['exception' => $exception]);
            return response()->json(['error' => 'Erro interno do servidor'], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $service = Service::findOrFail($id);

            $this->deleteServiceAssociations($service);

            $service->delete();

            DB::commit();
            Cache::forget('services_index');

            return response()->json(['message' => 'Deleted'], 200);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = $request->query('q');
            $services = Service::whereRaw('LOWER(service_name) LIKE ?', ['%' . strtolower($query) . '%'])
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json($services, 200);
        } catch (Exception $exception) {
            Log::error('Error searching services: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    private function prepareSaiData($serviceId, $associations)
    {
        $saiData = [];
        $existingCombinations = [];

        if ($associations) {
            foreach ($associations as $association) {
                $combinationKey = $association['activity_id'] . '_' . $association['indicator_id'];

                if (in_array($combinationKey, $existingCombinations)) {
                    throw new Exception('Associação duplicada detectada para activity_id: ' . $association['activity_id'] . ', indicator_id: ' . $association['indicator_id']);
                }

                $existingSai = Sai::where('service_id', $serviceId)
                    ->where('activity_id', $association['activity_id'])
                    ->where('indicator_id', $association['indicator_id'])
                    ->first();

                if (!$existingSai) {
                    $saiData[] = [
                        'service_id' => $serviceId,
                        'activity_id' => $association['activity_id'],
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

    private function deleteServiceAssociations($service)
    {
        $sais = $service->sais;

        foreach ($sais as $sai) {
            DB::table('goals')->where('sai_id', $sai->id)->delete();
            DB::table('records')->where('sai_id', $sai->id)->delete();
            $sai->delete();
        }
    }
    
}