<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $activities = [
            ['activity_name' => 'Psiquiatria Infância e Adolescência', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Psiquiatria Adultos', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Quadro Resumo', 'created_at' => now(), 'updated_at' => now()],
        ];

        
        for ($i = 4; $i <= 23; $i++) {
            $activities[] = [
                'activity_name' => 'activity' . $i,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        DB::table('activities')->insert($activities);
    }
}
