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
                'nif' => '123456789', // NIF fixo para o usuário root
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Avelino Almeida',
                'email' => 'admin@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'nif' => '234567890', // NIF fixo para o administrador
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Joao',
                'email' => 'admin2@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'nif' => '345678901', // NIF fixo para o administrador
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'David',
                'email' => 'coo@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'nif' => '456789012', // NIF fixo para o coordenador
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Gonçalo',
                'email' => 'colab@example.com',
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'nif' => '567890123', // NIF fixo para o colaborador
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        for ($i = 0; $i < 195; $i++) {
            $users[] = [
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => password_hash('atec123', PASSWORD_BCRYPT),
                'nif' => $faker->unique()->numerify('#########'), // Gerar NIF único de 9 dígitos
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        DB::table('users')->insert($users);
    }
}