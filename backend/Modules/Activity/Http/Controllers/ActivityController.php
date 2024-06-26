<?php
namespace Modules\Activity\Http\Controllers;


use Illuminate\Http\Request;
use Modules\Activity\Entities\Activity;
use App\Http\Controllers\Controller;
use Exception;

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
            $activities = Activity::all();
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
            $activity = new Activity();
            $activity->activity_name = $request->activity_name;
            $activity->save();
    
            // Associar atividades e indicadores à atividade
            if ($request->has('activities') && $request->has('indicators')) {
                foreach ($request->activities as $activityId) {
                    foreach ($request->indicators as $indicatorId) {
                        $activity->serviceActivityIndicators()->create([
                            'activity_id' => $activityId,
                            'indicator_id' => $indicatorId
                        ]);
                    }
                }
            }
    
            DB::commit();
            return response()->json($activity->load('serviceActivityIndicators.indicator'), 201);
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
            $activity = Activity::findOrFail($id);
            return response()->json($activity->load('serviceActivityIndicators.indicator'), 200);
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
            $activity->update($request->only(['activity_name']));
    
            // Atualiza atividades associadas
            $activity->serviceActivityIndicators()->delete(); // Remove todas as associações existentes
    
            if ($request->has('activities') && $request->has('indicators')) {
                foreach ($request->activities as $activityId) {
                    foreach ($request->indicators as $indicatorId) {
                        $activity->serviceActivityIndicators()->create([
                            'activity_id' => $activityId,
                            'indicator_id' => $indicatorId
                        ]);
                    }
                }
            }
    
            DB::commit();
            return response()->json($activity->load('serviceActivityIndicators.indicator'), 200);
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
            $activities = Activity::where('activity_name', 'LIKE', '%' . $request->search . '%')
                ->orderBy('updated_at', 'desc')
                ->get();
            return response()->json($activities, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
