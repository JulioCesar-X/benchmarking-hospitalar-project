<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('notifications')->insert([
            [
                'sender_id' => 1,  // João como remetente
                'receiver_id' => 2,  // David como destinatário
                'title' => 'Lembrete',
                'message' => 'Inserir dados Fevereiro',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 1,  // João como remetente
                'receiver_id' => 2,  // David como destinatário
                'title' => 'Lembrete',
                'message' => 'Inserir dados Março',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'sender_id' => 2,  // David como remetente
                'receiver_id' => 1,  // João como destinatário
                'title' => 'Dúvida',
                'message' => 'Quando Inserir dados de Abril?',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
