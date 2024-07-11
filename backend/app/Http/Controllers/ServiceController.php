<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service;
use Exception;
use App\Sai;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;


class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $cacheKey = 'services_index';

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $services = Service::with(['sais' => function ($query) {
                $query->select('id', 'activity_id', 'indicator_id', 'service_id');
            }, 'sais.activity:id,activity_name', 'sais.indicator:id,indicator_name'])
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
            return response()->json(['error' => $exception->getMessage()], 500);
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
        DB::beginTransaction();
        try {
            $service = Service::create([
                'service_name' => $request->service_name,
                'description' => $request->description,
                'image_url' => $request->image_url
            ]);

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

            // Clear the cache
            Cache::forget('services_index');

            return response()->json($service->load('sais'), 201);
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
        try {
            $service = Service::with(['sais' => function ($query) {
                $query->select('id', 'activity_id', 'indicator_id', 'service_id');
            }, 'sais.activity:id,activity_name', 'sais.indicator:id,indicator_name'])
            ->select('id', 'service_name', 'image_url', 'description')
            ->findOrFail($id);

            return response()->json($service, 200);
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
    public function update(Request $request, Service $service)
    {
        DB::beginTransaction();
        try {
            $service->update([
                'service_name' => $request->service_name,
                'description' => $request->description,
                'image_url' => $request->image_url
            ]);

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

            // Clear the cache
            Cache::forget('services_index');

            return response()->json($service->load('sais'), 200);
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
            $service = Service::findOrFail($id);
            $service->delete();

            DB::commit();

            // Clear the cache
            Cache::forget('services_index');

            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = $request->query('q');
            $service = Service::whereRaw('LOWER(service_name) LIKE ?', ['%' . strtolower($query) . '%'])
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($service, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    
}
