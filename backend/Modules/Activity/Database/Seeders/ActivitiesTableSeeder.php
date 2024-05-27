<?php

namespace Modules\Activity\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('activities')->insert([
            ['activity_name' => 'Psiquiatria Infância e Adolescência', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Psiquiatria Adultos', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Quadro Resumo', 'created_at' => now(), 'updated_at' => now()]
        ]);
    }
}
