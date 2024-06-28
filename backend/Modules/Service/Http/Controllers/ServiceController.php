<?php

namespace Modules\Service\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Service\Entities\Service;
use App\Http\Controllers\Controller;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Illuminate\Support\Facades\DB;
use Exception;


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
            // Carregar todos os serviços com os relacionamentos ServiceActivityIndicators
            $services = Service::with(['serviceActivityIndicators.activity', 'serviceActivityIndicators.indicator'])
            ->get()
                ->map(function ($service) {
                    // Transformar os dados para incluir atividades e indicadores associados
                    $activities = $service->serviceActivityIndicators->map(function ($sai) {
                        if (isset($sai->activity) && !is_null($sai->activity)) {
                            return [
                                'id' => $sai->activity->id,
                                'name' => $sai->activity->activity_name
                            ];
                        }
                        return null;
                    })->filter()->unique('id')->values();

                    $indicators = $service->serviceActivityIndicators->map(function ($sai) {
                        if (isset($sai->indicator) && !is_null($sai->indicator)) {
                            return [
                                'id' => $sai->indicator->id,
                                'name' => $sai->indicator->indicator_name
                            ];
                        }
                        return null;
                    })->filter()->unique('id')->values();

                    return [
                        'id' => $service->id,
                        'name' => $service->service_name,
                        'imageUrl' => $service->imageUrl,
                        'activities' => $activities,
                        'indicators' => $indicators
                    ];
                });

            return response()->json(['data' => $services], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getServicesPaginated(Request $request){
        try {
            $pageSize = $request->input('size');
            $pageIndex = $request->input('page');

            $services = Service::query()
                ->orderBy('created_at', 'desc')
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
                'imageUrl' => $request->imageUrl
            ]);

            foreach ($request->activity_ids as $activityId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    ServiceActivityIndicator::create([
                        'activity_id' => $activityId,
                        'service_id' => $service->id,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ]);
                }
            }

            DB::commit();
            return response()->json($service->load('serviceActivityIndicators'), 201);
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
            $service = Service::with(['serviceActivityIndicators.activity', 'serviceActivityIndicators.indicator'])
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
                'imageUrl' => $request->imageUrl
            ]);

            // Create new SAIs
            foreach ($request->activity_ids as $activityId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    ServiceActivityIndicator::create([
                        'activity_id' => $activityId,
                        'service_id' => $service->id,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ]);
                }
            }

            DB::commit();
            return response()->json($service->load('serviceActivityIndicators'), 200);
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
        try {
            $service = Service::findOrFail($id);
            $service->delete();
            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    /**
     * Search for service based on a keyword.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try {
            $query = $request->query('q');
            $service = Service::where('service_name', 'LIKE', '%' . $query . '%')
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($service, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
