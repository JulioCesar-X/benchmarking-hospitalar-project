<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Activity;
use App\Sai;
use Exception;
use Illuminate\Support\Facades\DB;


class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            // Carregar todas as atividades com os relacionamentos de SAI, serviços e indicadores
            $activities = Activity::with(['sais.service', 'sais.indicator'])->get()
                ->map(function ($activity) {
                    $services = $activity->sais->map(function ($sai) {
                        if ($sai->service) {
                            return [
                                'id' => $sai->service->id,
                                'name' => $sai->service->service_name
                            ];
                        }
                        return null;
                    })->filter()->unique('id')->values();

                    $indicators = $activity->sais->map(function ($sai) {
                        if ($sai->indicator) {
                            return [
                                'id' => $sai->indicator->id,
                                'name' => $sai->indicator->indicator_name
                            ];
                        }
                        return null;
                    })->filter()->unique('id')->values();

                    return [
                        'id' => $activity->id,
                        'activity_name' => $activity->activity_name,
                        'services' => $services,
                        'indicators' => $indicators
                    ];
                });

            return response()->json($activities, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Display a listing of the resource paginated.
     *
     * @return \Illuminate\Http\Response
     */
    public function getActivitiesPaginated(Request $request)
    {
        try {
            $pageSize = $request->input('size');
            $pageIndex = $request->input('page');
            $activities = Activity::query()
                ->orderBy('created_at', 'desc')
                ->paginate($pageSize, ['*'], 'page', $pageIndex);

            return response()->json($activities, 200);
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
            $activity = Activity::create(['activity_name' => $request->activity_name]);

            foreach ($request->service_ids as $serviceId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    Sai::create([
                        'service_id' => $serviceId,
                        'activity_id' => $activity->id,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ]);
                }
            }

            DB::commit();
            return response()->json($activity->load('sais'), 201);
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
            $activity = Activity::findOrFail($id);
            return response()->json($activity->load('sais.indicator', 'sais.service'), 200);
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
    public function update(Request $request, Activity $activity)
    {
        DB::beginTransaction();
        try {
            $activity->update(['activity_name' => $request->activity_name]);

            // Create new SAIs
            foreach ($request->service_ids as $serviceId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    Sai::create([
                        'service_id' => $serviceId,
                        'activity_id' => $activity->id,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ]);
                }
            }

            DB::commit();
            return response()->json($activity->load('sais'), 200);
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
            $activity = Activity::findOrFail($id);
            $activity->delete();
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
            $query = $request->query('q');
            $activities = Activity::where('activity_name', 'LIKE', '%' . $query . '%')
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($activities, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
