<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('notifications')->insert([
            // 10 mensagens de João para David
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Janeiro',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Fevereiro',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Março',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Abril',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Maio',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Junho',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Julho',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Agosto',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Setembro',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'title' => 'Lembrete',
                'message' => 'Inserir dados Outubro',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // 10 mensagens de David para João
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Janeiro?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Fevereiro?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Março?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Abril?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Maio?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Junho?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Julho?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Agosto?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Setembro?',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'title' => 'Dúvida',
                'message' => 'Quando inserir dados de Outubro?',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
