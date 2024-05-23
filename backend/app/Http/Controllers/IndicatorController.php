<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Indicator;
use Exception;

use Illuminate\Http\Request;

class IndicatorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $indicators = Indicator::all();
            return response()->json($indicators, 200);
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
        try {
            $indicator = Indicator::create($request->all());
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
            $indicator = Indicator::findOrFail($id);
            return response()->json($indicator->load('servicesActivityIndicators'), 200);
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
    public function update(Request $request,Indicator $indicator)
    {
        try {
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
            $indicator = Indicator::findOrFail($id);
            $indicator->delete();
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

            return response()->json(Indicator::all()->orderBy('updated_at', 'desc')->where('name', 'LIKE', '%' . $request->search . '%')->get(), 200); //search = name do form

        } catch (Exception $exception) {

            return response()->json(['error' => $exception], 500);
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
