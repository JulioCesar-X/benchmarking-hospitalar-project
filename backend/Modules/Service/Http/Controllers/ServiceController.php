<?php

namespace Modules\Service\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Service\Entities\Service;
use App\Http\Controllers\Controller;
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
            $services = Service::all();
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
            $service = new Service();
            $service->service_name = $request->service_name;
            $service->description = $request->description;
            $service->imageUrl = $request->imageUrl;
            $service->save();

            // Associar atividades e indicadores ao serviço
            if ($request->has('activities') && $request->has('indicators')) {
                foreach ($request->activities as $activityId) {
                    foreach ($request->indicators as $indicatorId) {
                        $service->serviceActivityIndicators()->create([
                            'activity_id' => $activityId,
                            'indicator_id' => $indicatorId
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json($service->load(['serviceActivityIndicators', 'serviceActivityIndicators.indicator']), 201);
        } catch (\Exception $exception) {
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
    public function update($serviceId, Request $request)
    {
        DB::beginTransaction();
        try {
            $service = Service::findOrFail($serviceId);
            $service->update($request->only(['service_name', 'description', 'imageUrl']));

            // Atualiza atividades associadas
            $service->serviceActivityIndicators()->whereNotIn('activity_id', $request->activities ?? [])->delete();
            foreach ($request->activities ?? [] as $activityId) {
                $service->serviceActivityIndicators()->updateOrCreate(['activity_id' => $activityId]);
            }

            // Atualiza indicadores associados
            $service->serviceActivityIndicators()->whereNotIn('indicator_id', $request->indicators ?? [])->delete();
            foreach ($request->indicators ?? [] as $indicatorId) {
                $service->serviceActivityIndicators()->updateOrCreate(['indicator_id' => $indicatorId]);
            }

            DB::commit();
            return response()->json($service, 200);
        } catch (\Exception $exception) {
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
            //Quando deletar um serviço perco todos os registros para aquele serviço?
            $service = Service::findOrFail($id);
            $service->delete();
            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    /**
     * Search for activities based on a keyword.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try {

            return response()->json(Service::all()->orderBy('updated_at', 'desc')->where('name', 'LIKE', '%' . $request->search . '%')->get(), 200); //search = name do form

        } catch (Exception $exception) {

            return response()->json(['error' => $exception], 500);
        }
    }
}
