<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notification;
use App\User;
use Illuminate\Support\Facades\Validator;
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
    public function update(Request $request, Notification $notification)
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
        // Validação de entrada
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            // Obter o email fornecido na requisição
            $email = $request->input('email');

            // Verificar se o usuário existe
            $user = User::where('email', $email)->first();

            if (!$user) {
                return response()->json(['error' => 'Usuário não encontrado'], 404);
            }

            // Adicione esta linha para garantir que o ID do usuário é um número válido
            if (!is_numeric($user->id)) {
                throw new \Exception('User ID is not a valid number');
            }

            // Buscar todas as notificações recebidas pelo usuário com base no relacionamento
            $notifications = $user->receivedNotifications()->with(['sender', 'receiver'])->get();

            // Formatar as notificações para incluir os nomes dos remetentes e destinatários
            $formattedNotifications = $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'sender' => $notification->sender ? $notification->sender->name : 'Unknown',
                    'receiver' => $notification->receiver ? $notification->receiver->name : 'Unknown',
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'created_at' => $notification->created_at
                ];
            });

            return response()->json($formattedNotifications);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar notificações', 'message' => $e->getMessage()], 500);
        }
    }
}
