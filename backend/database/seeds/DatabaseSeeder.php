<?php

use App\Service;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            RoleSeeder::class,
            RoleUserSeeder::class,
            // NotificationSeeder::class,
            ServiceSeeder::class,
            ActivitySeeder::class,
            IndicatorSeeder::class,
            SaiSeeder::class,
            RecordSeeder::class,
            GoalSeeder::class
        ]);
    }
}
