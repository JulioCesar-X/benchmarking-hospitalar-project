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

class GoalController extends Controller
{
    public function update(Request $request, Goal $goal)
    {
        $validator = Validator::make($request->all(), [
            'target_value' => 'required|numeric',
            'year' => 'required|integer|min:1900|max:2100'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $goal->update($request->all());
            $this->notifyRootIfNotNotified();
            return response()->json($goal, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'target_value' => 'required|numeric',
            'year' => 'required|integer|min:1900|max:2100',
            'sai_id' => 'required|exists:sais,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            // Remove a verificação de duplicidade baseada no ano
            $goal = Goal::create($request->all());
            $this->notifyRootIfNotNotified();
            return response()->json($goal, 201);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    private function notifyRootIfNotNotified()
    {
        $date = now()->format('Y-m-d');
        $cacheKey = "root_notified_{$date}";

        if (!Cache::has($cacheKey)) {
            $root = User::whereHas('roles', function ($query) {
                $query->where('role_name', 'Root');
            })->first();

            if ($root) {
                Mail::to($root->email)->send(new UpdateDataMail());
                Cache::put($cacheKey, true, now()->endOfDay());
            }
        }
    }
}