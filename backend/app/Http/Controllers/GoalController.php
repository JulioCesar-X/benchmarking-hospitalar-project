<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\UpdateDataMail;
use Illuminate\Support\Facades\Cache;
use App\Goal;
use App\User;
use Exception;
use Illuminate\Support\Facades\Log;

class GoalController extends Controller
{
    public function update(Request $request, Goal $goal)
    {
        $validator = $this->validateGoal($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $goal->update($request->all());
            $this->notifyRootIfNotNotified();
            Cache::forget("goal_{$goal->id}");
            return response()->json($goal, 200);
        } catch (Exception $exception) {
            Log::error('Error updating goal: ', ['exception' => $exception]);
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = $this->validateGoal($request);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $goal = Goal::create($request->all());
            $this->notifyRootIfNotNotified();
            Cache::forget("goal_{$goal->id}");
            return response()->json($goal, 201);
        } catch (Exception $exception) {
            Log::error('Error storing goal: ', ['exception' => $exception]);
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    private function validateGoal($request)
    {
        return Validator::make($request->all(), [
            'target_value' => 'required|numeric',
            'year' => 'required|integer|min:1900|max:2100',
            'sai_id' => 'required|exists:sais,id'
        ]);
    }

    private function notifyRootIfNotNotified()
    {
        $date = now()->format('Y-m-d');
        $cacheKey = "root_notified_{$date}";

        if (!Cache::has($cacheKey)) {
            $root = User::whereHas('roles', function ($query) {
                // $query->where('role_name', 'Root');
                $query->where('role_name', 'Admin');
            })->first();

            if ($root) {
                Mail::to($root->email)->send(new UpdateDataMail());
                Cache::put($cacheKey, true, now()->endOfDay());
            }
        }
    }
}