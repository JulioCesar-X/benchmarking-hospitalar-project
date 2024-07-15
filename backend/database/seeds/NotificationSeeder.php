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

            $notifications[] = [
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'title' => $faker->sentence,
                'message' => $faker->paragraph,
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => now()
            ];
        }

        DB::table('notifications')->insert($notifications);
    }
}