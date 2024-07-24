<?php


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $timestamp = Carbon::now();

        $roleUser = [
            ['user_id' => 1, 'role_id' => 4, 'created_at' => $timestamp, 'updated_at' => $timestamp], // Root
            ['user_id' => 2, 'role_id' => 1, 'created_at' => $timestamp, 'updated_at' => $timestamp], // Avelino como Admin
            ['user_id' => 3, 'role_id' => 1, 'created_at' => $timestamp, 'updated_at' => $timestamp], // João como Admin
            ['user_id' => 4, 'role_id' => 2, 'created_at' => $timestamp, 'updated_at' => $timestamp], // David como Coordenador
            ['user_id' => 5, 'role_id' => 3, 'created_at' => $timestamp, 'updated_at' => $timestamp]  // Gonçalo como User
        ];

        for ($i = 6; $i <= 195; $i++) {
            $roleUser[] = [
                'user_id' => $i,
                'role_id' => 3,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ]; // Restantes como User
        }

        DB::table('role_user')->insert($roleUser);
    }
}