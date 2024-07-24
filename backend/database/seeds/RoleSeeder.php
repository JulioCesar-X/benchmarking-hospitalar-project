<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['role_name' => 'Admin', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Coordenador', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'User', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Root', 'created_at' => now(), 'updated_at' => now()]
        ]);
    }
}
