<?php

use App\Goal;
use App\Record;
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

            UsersTableSeeder::class,
            RolesTableSeeder::class,
            RoleUserTableSeeder::class,
            NotificationsTableSeeder::class,
            ServicesTableSeeder::class,
            ActivitiesTableSeeder::class,
            IndicatorsTableSeeder::class,
            ServiceActivityIndicatorsTableSeeder::class,
            RecordsTableSeeder::class,
            GoalsTableSeeder::class

        ]);
    }
}
