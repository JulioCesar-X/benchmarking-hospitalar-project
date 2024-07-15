<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roleUser = [
            ['user_id' => 1, 'role_id' => 4], // Root
            ['user_id' => 2, 'role_id' => 1], // Avelino como Admin
            ['user_id' => 3, 'role_id' => 1], // João como Admin
            ['user_id' => 4, 'role_id' => 2], // David como Coordenador
            ['user_id' => 5, 'role_id' => 3]  // Gonçalo como User
        ];

        for ($i = 5; $i <= 195; $i++) {
            $roleUser[] = ['user_id' => $i, 'role_id' => 3]; // Restantes como User
        }

        DB::table('role_user')->insert($roleUser);
    }
}