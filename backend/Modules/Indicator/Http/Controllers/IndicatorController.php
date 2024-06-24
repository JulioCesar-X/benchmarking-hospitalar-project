<?php

namespace Modules\Indicator\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Modules\Indicator\Entities\Indicator;
use Modules\Goal\Entities\Goal;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Exception;
use Illuminate\Http\Request;

class IndicatorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $pageSize = $request->input('size', 10);
        $page = $request->input('page', 1);
        $indicators = Indicator::paginate($pageSize, ['*'], 'page', $page);

        // Formatando a resposta para combinar com o frontend esperado
        return response()->json([
            'data' => $indicators->items(),
            'total' => $indicators->total()
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {

            $indicator = Indicator::create($request->only(['indicator_name']));

            $serviceActivityIndicator = ServiceActivityIndicator::create([
            'service_id' => $request->input('service_id'),
            'activity_id' => $request->input('activity_id'),
            'indicator_id' => $indicator->id,
            'type' => $request->input('type')
        ]);
            // Criar o Goal associado
            $goal = Goal::create([
                'service_activity_indicator_id' => $serviceActivityIndicator->id,
                'target_value' => $request->input('target_value'),
                'year' => $request->input('year')
            ]);
            return response()->json($indicator->load('serviceActivityIndicators'), 201);

        } catch (Exception $exception) {
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
            $indicator = Indicator::with([
                'serviceActivityIndicators.service',
                'serviceActivityIndicators.activity',
                'serviceActivityIndicators.goals',
                'serviceActivityIndicators.records'
            ])->findOrFail($id);

            return response()->json($indicator, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
        // try {
        //     $indicator = Indicator::findOrFail($id);
        //     return response()->json($indicator->load('serviceActivityIndicators'), 200);
        // } catch (Exception $exception) {
        //     return response()->json(['error' => $exception->getMessage()], 500);
        // }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $indicator = Indicator::findOrFail($id);
            $indicator->update($request->all());
            return response()->json($indicator, 200);
        } catch (Exception $exception) {
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
            // Encontrar o indicador pelo ID
            $indicator = Indicator::findOrFail($id);

            // Deletar os registros relacionados em service_activity_indicators e suas metas
            $serviceActivityIndicators = $indicator->serviceActivityIndicators;
            foreach ($serviceActivityIndicators as $serviceActivityIndicator) {
                // Deletar as metas relacionadas
                Goal::where('service_activity_indicator_id', $serviceActivityIndicator->id)->delete();
                // Deletar os registros
                $serviceActivityIndicator->delete();
            }

            // Deletar o indicador
            $indicator->delete();

            return response()->json(['message' => 'Indicator and related records deleted successfully'], 205);
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
            $searchTerm = $request->input('search', '');

            $indicators = Indicator::with([
                'serviceActivityIndicators.service',
                'serviceActivityIndicators.activity',
                'serviceActivityIndicators.goals',
                'serviceActivityIndicators.records'
            ])
                ->where('indicator_name', 'LIKE', '%' . $searchTerm . '%')
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json($indicators, 200);
        } catch (Exception $exception) {
            Log::error('Search Error:', ['error' => $exception->getMessage()]);
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Get the accumulated indicators.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAccumulatedIndicators()
    {
        try {
            $data = DB::table('vw_indicator_accumulated')->get();
            return response()->json($data, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

}
