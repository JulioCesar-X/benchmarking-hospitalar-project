<?php

namespace Modules\Goal\Http\Controllers;
use Modules\Goal\Entities\Goal;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
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
    public function update(Request $request, Goal $goal)
    {
        // Validação dos parâmetros de entrada
        $validator = Validator::make($request->all(), [
            'target_value' => 'required|string',
            'year' => 'required|integer|min:1900|max:2100'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            // Atualização da meta
            $goal->update($request->all());
            return response()->json($goal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

}
