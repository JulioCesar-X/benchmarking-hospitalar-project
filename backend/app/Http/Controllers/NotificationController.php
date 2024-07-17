<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notification;
use App\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
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
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            $cacheKey = 'notifications_index_' . $user->id;

            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey), 200);
            }

            $notifications = Notification::with(['sender:id,name', 'receiver:id,name'])
                ->where(function ($query) use ($user) {
                    $query->where('receiver_id', $user->id)
                        ->orWhere('sender_id', $user->id);
                })
                ->get();

            Cache::put($cacheKey, $notifications, now()->addMinutes(30));

            return response()->json($notifications, 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|integer|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notification = Notification::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'title' => $request->title,
            'message' => $request->message,
            'response' => null,
            'is_read' => true
        ]);

        Cache::forget('notifications_index_' . Auth::id());
        Cache::forget('notifications_index_' . $request->receiver_id);

        return response()->json($notification, 201);
    }

    public function markAsRead($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->is_read = true;
            $notification->save();

            Cache::forget('notifications_index_' . $notification->receiver_id);

            return response()->json(['message' => 'Notification marked as read.'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error marking notification as read', 'message' => $e->getMessage()], 500);
        }
    }

   public function getUnreadNotifications(Request $request)
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }

        // Notificações recebidas que não foram lidas
        $receivedNotifications = Notification::where('receiver_id', $user->id)
            ->where('is_read', false)
            ->where('receiver_id', '!=', $user->id) // Certifique-se de que o receiver não é o próprio usuário
            ->with(['sender:id,name,email', 'receiver:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Respostas a notificações enviadas pelo usuário que não foram lidas e que foram respondidas por alguém que não seja o próprio usuário
        $sentNotificationsResponses = Notification::where('sender_id', $user->id)
            ->whereNotNull('response')
            ->where('receiver_id', '!=', $user->id) // Certifique-se de que o receiver não é o próprio usuário
            ->where('is_read', false)
            ->with(['sender:id,name,email', 'receiver:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        $allNotifications = $receivedNotifications->merge($sentNotificationsResponses);

        $formattedNotifications = $allNotifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'sender' => $notification->sender ? $notification->sender->name : 'Unknown',
                'sender_email' => $notification->sender ? $notification->sender->email : 'Unknown',
                'receiver' => $notification->receiver ? $notification->receiver->name : 'Unknown',
                'title' => $notification->title,
                'message' => $notification->message,
                'created_at' => $notification->created_at->format('Y-m-d H:i:s'),
                'is_read' => $notification->is_read,
                'response' => $notification->response,
                'updated_at' => $notification->updated_at ? $notification->updated_at->format('Y-m-d H:i:s') : null,
            ];
        });

        return response()->json($formattedNotifications, 200);
    } catch (Exception $e) {
        return response()->json(['error' => 'Erro ao buscar notificações', 'message' => $e->getMessage()], 500);
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
                ->with(['sender:id,name,email', 'receiver:id,name,email'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $formattedNotifications = $notifications->getCollection()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'sender' => $notification->sender ? $notification->sender->name : 'Unknown',
                    'receiver' => $notification->receiver ? $notification->receiver->name : 'Unknown',
                    'sender_email' => $notification->sender ? $notification->sender->email : 'Unknown',
                    'receiver_email' => $notification->receiver ? $notification->receiver->email : 'Unknown',
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

    public function respondToNotification(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'response' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $notification = Notification::findOrFail($id);
            $notification->response = $request->input('response');
            $notification->is_read = false;
            $notification->save();

            Cache::forget('notifications_index_' . $notification->sender_id);

            $notification->load(['sender:id,name', 'receiver:id,name']);
            return response()->json($notification, 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getAllNotificationSent(Request $request)
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
            $notifications = $user->sentNotifications()
                ->with(['sender:id,name,email', 'receiver:id,name,email'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $formattedNotifications = $notifications->getCollection()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'sender' => $notification->sender ? $notification->sender->name : 'Unknown',
                    'receiver' => $notification->receiver ? $notification->receiver->name : 'Unknown',
                    'sender_email' => $notification->sender ? $notification->sender->email : 'Unknown',
                    'receiver_email' => $notification->receiver ? $notification->receiver->email : 'Unknown',
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