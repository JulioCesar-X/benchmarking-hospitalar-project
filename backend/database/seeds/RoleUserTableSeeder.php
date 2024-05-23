<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleUserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('role_user')->insert([
            ['user_id' => 1, 'role_id' => 1], // João como Admin
            ['user_id' => 2, 'role_id' => 2], // David como Coordenador
            ['user_id' => 3, 'role_id' => 3], // Gonçalo como Colaborador
        ]);
    }
}
