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
            ['user_id' => 2, 'role_id' => 1, 'created_at' => $timestamp, 'updated_at' => $timestamp], // David como Admin
        ];

        for ($i = 3; $i <= 100; $i++) {
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