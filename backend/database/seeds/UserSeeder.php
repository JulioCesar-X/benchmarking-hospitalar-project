<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        $users = [
            [
                'name' => 'root',
                'email' => 'julio.pereira.t0126213@edu.atec.pt',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Avelino Almeida',
                'email' => 'admin@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Joao',
                'email' => 'admin2@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'David',
                'email' => 'coo@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Gonçalo',
                'email' => 'colab@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        for ($i = 0; $i < 200; $i++) {
            $users[] = [
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        DB::table('users')->insert($users);
    }
}