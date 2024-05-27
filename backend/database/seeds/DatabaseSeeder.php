<?php

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
            \Modules\User\Database\Seeders\UserDatabaseSeeder::class,
            \Modules\Role\Database\Seeders\RoleDatabaseSeeder::class,
            \Modules\Notification\Database\Seeders\NotificationDatabaseSeeder::class,
            \Modules\Service\Database\Seeders\ServiceDatabaseSeeder::class,
            \Modules\Activity\Database\Seeders\ActivityDatabaseSeeder::class,
            \Modules\Indicator\Database\Seeders\IndicatorDatabaseSeeder::class,
            \Modules\ServiceActivityIndicator\Database\Seeders\ServiceActivityIndicatorDatabaseSeeder::class,
            \Modules\Goal\Database\Seeders\GoalDatabaseSeeder::class,
            \Modules\Record\Database\Seeders\RecordDatabaseSeeder::class,
        ]);
    }
}
