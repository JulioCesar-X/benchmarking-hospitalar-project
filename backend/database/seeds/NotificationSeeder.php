<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $userIds = range(1, 5);

        $notifications = [];

        for ($i = 0; $i < 50; $i++) { // Criar 50 notificações aleatórias
            $senderId = $faker->randomElement($userIds);
            $receiverId = $faker->randomElement(array_diff($userIds, [$senderId]));
            $hasResponse = $faker->boolean(50); // 50% de chance de ter uma resposta

            $notifications[] = [
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'title' => $faker->sentence,
                'message' => $faker->paragraph,
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => $hasResponse ? now() : null,
                'response' => $hasResponse ? $faker->paragraph : null, // Resposta ou null
                'is_read' => $hasResponse ? true : $faker->boolean(70) // Se tiver resposta, está lida, caso contrário, 70% de chance de ser lida
            ];
        }

        DB::table('notifications')->insert($notifications);
    }
}