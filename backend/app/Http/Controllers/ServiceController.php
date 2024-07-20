<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
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

    public function getServicesPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size', 15);
            $pageIndex = $request->input('page', 1);

            $services = Service::orderBy('created_at', 'desc')
                ->paginate($pageSize, ['*'], 'page', $pageIndex);

            return response()->json($services, 200);
        } catch (Exception $exception) {
            Log::error('Error fetching paginated services: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function store(StoreServiceRequest $request)
    {

        DB::beginTransaction();
        try {

            $service = Service::create($request->only(['service_name', 'description', 'image_url', 'more_info']));

            $saiData = [];
            foreach ($request->activity_ids as $activityId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    $saiData[] = [
                        'activity_id' => $activityId,
                        'service_id' => $service->id,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ];
                }
            }

            Sai::insert($saiData);

            DB::commit();
            Cache::forget('services_index');

            return response()->json($service->load('sais.activity:id,activity_name', 'sais.indicator:id,indicator_name'), 201);
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error('Error creating service: ', ['exception' => $exception]);
            return response()->json(['error' => 'Internal Server Error'], 500);
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
            // Encontra o serviço pelo ID
            $service = Service::findOrFail($request->id);

            // Atualiza o serviço
            $service->update([
                'service_name' => $request->service_name,
                'description' => $request->description,
                'image_url' => $request->image_url,
                'more_info' => $request->more_info
            ]);

            // Remove as associações atuais
            // Primeiro, removemos ou atualizamos os registros dependentes nas tabelas 'goals' e 'records'
            $sais = $service->sais;
            foreach ($sais as $sai) {
                // Deletar registros na tabela 'goals' que referenciam este 'sai'
                DB::table('goals')->where('sai_id', $sai->id)->delete();
                // Deletar registros na tabela 'records' que referenciam este 'sai'
                DB::table('records')->where('sai_id', $sai->id)->delete();
            }

            // Agora podemos deletar as associações na tabela 'sais'
            $service->sais()->delete();

            // Prepara os dados para inserção
            $saiData = [];
            foreach ($request->activity_ids as $activityId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    $saiData[] = [
                        'service_id' => $service->id,
                        'activity_id' => $activityId,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ];
                }
            }

            // Insere novos registros
            Sai::insert($saiData);

            DB::commit();

            // Limpa o cache
            Cache::forget('services_index');

            return response()->json($service->load('sais'), 200);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }



    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $service = Service::findOrFail($id);
            $service->delete();

            DB::commit();
            Cache::forget('services_index');
            Cache::forget("service_{$id}");

            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error('Error deleting service: ', ['exception' => $exception->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
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
}