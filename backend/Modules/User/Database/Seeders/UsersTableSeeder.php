<?php

namespace Modules\User\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        DB::table('users')->insert([
            [
                'name' => 'João',
                'email' => 'admin@example.com',
                'password' => Hash::make('atec123'), // Usando Hash para a senha
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'David',
                'email' => 'coo@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Gonçalo',
                'email' => 'cola@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
			        [
                'name' => $faker->name,
                'email' => 'jun@example.com',
                'password' => Hash::make('atec123'), // Usando Hash para a senha
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'jan@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'jen@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
			        [
                'name' => $faker->name,
                'email' => 'jin@example.com',
                'password' => Hash::make('atec123'), // Usando Hash para a senha
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'car@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'comn@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
			        [
                'name' => $faker->name,
                'email' => 'ea@example.com',
                'password' => Hash::make('atec123'), // Usando Hash para a senha
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'lolo@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'eaa@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
			        [
                'name' => $faker->name,
                'email' => 'uni@example.com',
                'password' => Hash::make('atec123'), // Usando Hash para a senha
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'are@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'ert@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
			       [
                'name' => $faker->name,
                'email' => 'pp@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'ii@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
			        [
                'name' => $faker->name,
                'email' => 'qq@example.com',
                'password' => Hash::make('atec123'), // Usando Hash para a senha
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'arzze@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => $faker->name,
                'email' => 'lll@example.com',
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            
        ]);

        // Adicionar 100 novos usuários
        for ($i = 1; $i <= 100; $i++) {
            $baseUsers[] = [
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('atec123'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        // Inserir todos os registros no banco de dados
        DB::table('users')->insert($baseUsers);
    }
}
