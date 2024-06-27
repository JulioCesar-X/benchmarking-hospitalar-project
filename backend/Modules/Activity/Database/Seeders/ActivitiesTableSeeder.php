<?php

namespace Modules\Activity\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ActivitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $baseActivities = [
            ['activity_name' => 'Psiquiatria Infância e Adolescência', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['activity_name' => 'Psiquiatria Adultos', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['activity_name' => 'Quadro Resumo', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
        ];

        // Adicionar 100 novas atividades ao $baseActivities
        for ($i = 1; $i <= 100; $i++) {
            $baseActivities[] = [
                'activity_name' => 'Atividade ' . $i,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ];
        }

        DB::table('activities')->insert($baseActivities);
    }
}
