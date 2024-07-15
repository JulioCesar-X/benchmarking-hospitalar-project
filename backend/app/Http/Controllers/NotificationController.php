<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notification;
use App\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Exception;


class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $cacheKey = 'notifications_index';

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $notifications = Notification::with(['sender:id,name', 'receiver:id,name'])->get();

            Cache::put($cacheKey, $notifications, now()->addMinutes(30));

            return response()->json($notifications, 200);
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
            $notification = Notification::create($request->all());

            // Clear the cache
            Cache::forget('notifications_index');

            return response()->json($notification->load(['sender:id,name', 'receiver:id,name']), 201);
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
            $notification = Notification::with(['sender:id,name', 'receiver:id,name'])->findOrFail($id);
            return response()->json($notification, 200);
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
    public function update(Request $request, Notification $notification)
    {
        try {
            $notification->update($request->all());

            // Clear the cache
            Cache::forget('notifications_index');

            return response()->json($notification->load(['sender:id,name', 'receiver:id,name']), 200);
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
            $notification = Notification::findOrFail($id);
            $notification->delete();

            // Clear the cache
            Cache::forget('notifications_index');

            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getAllNotificationReceived(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $email = $request->input('email');
            $user = User::where('email', $email)->first();

            if (!$user) {
                return response()->json(['error' => 'Usuário não encontrado'], 404);
            }

            $perPage = $request->input('per_page', 10);
            $notifications = $user->receivedNotifications()
                ->with(['sender:id,name', 'receiver:id,name'])
                ->orderBy('created_at', 'desc') // Ordenar por created_at em ordem decrescente
                ->paginate($perPage);

            $formattedNotifications = $notifications->getCollection()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'sender' => $notification->sender ? $notification->sender->name : 'Unknown',
                    'receiver' => $notification->receiver ? $notification->receiver->name : 'Unknown',
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'created_at' => $notification->created_at->format('Y-m-d'),
                    'is_read' => $notification->is_read,
                    'response' => $notification->response,
                    'updated_at' => $notification->updated_at ? $notification->updated_at->format('Y-m-d H:i:s') : null,
                ];
            });

            return response()->json([
                'data' => $formattedNotifications,
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar notificações', 'message' => $e->getMessage()], 500);
        }
    }
}
