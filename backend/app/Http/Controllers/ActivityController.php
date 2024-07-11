<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Activity;
use App\Sai;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

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
            $cacheKey = 'activities_index';

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $activities = Activity::with(['sais.service:id,service_name', 'sais.indicator:id,indicator_name'])
                ->select('id', 'activity_name')
                ->get()
                ->map(function ($activity) {
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
                });

            Cache::put($cacheKey, $activities, now()->addMinutes(30));

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
            $pageSize = $request->input('size', 15);
            $pageIndex = $request->input('page', 1);
            $activities = Activity::orderBy('created_at', 'desc')
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

            $saiData = [];
            foreach ($request->service_ids as $serviceId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    $saiData[] = [
                        'service_id' => $serviceId,
                        'activity_id' => $activity->id,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ];
                }
            }

            Sai::insert($saiData);

            DB::commit();

            // Clear the cache
            Cache::forget('activities_index');

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
            $activity = Activity::with(['sais.service:id,service_name', 'sais.indicator:id,indicator_name'])
                ->select('id', 'activity_name')
                ->findOrFail($id);
            return response()->json($activity, 200);
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

            //Sai::where('activity_id', $activity->id)->delete();

            $saiData = [];
            foreach ($request->service_ids as $serviceId) {
                foreach ($request->indicator_ids as $indicatorId) {
                    $saiData[] = [
                        'service_id' => $serviceId,
                        'activity_id' => $activity->id,
                        'indicator_id' => $indicatorId,
                        'type' => 'default'
                    ];
                }
            }

            Sai::insert($saiData);

            DB::commit();

            // Clear the cache
            Cache::forget('activities_index');

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
        DB::beginTransaction();
        try {
            $activity = Activity::findOrFail($id);
            $activity->delete();

            DB::commit();

            // Clear the cache
            Cache::forget('activities_index');

            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            DB::rollBack();
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
            $activities = Activity::whereRaw('LOWER(activity_name) LIKE ?', ['%' . strtolower($query) . '%'])
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($activities, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
