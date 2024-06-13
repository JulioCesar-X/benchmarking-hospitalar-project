<?php

namespace Modules\Notification\Http\Controllers;
use Modules\Notification\Entities\Notification;
use App\Http\Controllers\Controller;
use Exception;


use Illuminate\Http\Request;

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
            $notifications = Notification::with(['sender', 'receiver'])->get();
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
            return response()->json($notification->load(['sender', 'receiver']), 201);
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
            $notification = Notification::findOrFail($id);
            return response()->json($notification->load(['sender', 'receiver']), 200);
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
    public function update(Request $request,Notification $notification)
    {
        try {
            $notification->update($request->all());
            return response()->json($notification, 200);
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
            return response()->json(['message' => 'Deleted'], 205);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getAllNotificationReceived(Request $request) 
    {
        try {
            // Obter o usuário pelo email fornecido na requisição
            $user = User::where('email', $request->input('email'))->first();

            if (!$user) {
                return response()->json(['error' => 'Usuário não encontrado'], 404);
            }

            // Buscar todas as notificações recebidas pelo usuário com base no relacionamento
            $notifications = $user->receivedNotifications()->get();

            return response()->json($notifications);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar notificações', 'message' => $e->getMessage()], 500);
        }
    }

}
