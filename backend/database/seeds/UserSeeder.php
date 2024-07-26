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
                'nif' => '555666888',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'David',
                'email' => 'david.fernandez.t0126207@edu.atec.pt',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'nif' => '456789012',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        for ($i = 3; $i <=100; $i++) {
            $users[] = [
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'nif' => $faker->unique()->numerify('#########'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        DB::table('users')->insert($users);
    }
}