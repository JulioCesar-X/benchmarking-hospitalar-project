<?php

namespace Modules\Goal\Http\Controllers;
use Modules\Goal\Entities\Goal;
use App\Http\Controllers\Controller;
use Exception;

use Illuminate\Http\Request;

class GoalController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,Goal $goal)
    {
        try {
            $goal->update($request->all());
            return response()->json($goal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

}
