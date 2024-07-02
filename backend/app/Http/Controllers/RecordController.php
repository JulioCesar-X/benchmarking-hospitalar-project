<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Record;
use Exception;


class RecordController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Record $record)
    {
        try {
            $record->update($request->all());
            return response()->json($record, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
