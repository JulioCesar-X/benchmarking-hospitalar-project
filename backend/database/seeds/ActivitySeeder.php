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
            ['activity_name' => 'Psicoterapia Individual', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Tratamento para Transtornos de Ansiedade', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Reabilitação Psicossocial', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Tratamento para Dependência Química', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Avaliação e Manejo de Risco', 'created_at' => now(), 'updated_at' => now()],
            ['activity_name' => 'Terapia Ocupacional', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('activities')->insert($activities);
    }
}
