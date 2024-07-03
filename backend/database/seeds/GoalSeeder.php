<?php

use Illuminate\Database\Seeder;
use App\Goal;
use App\Sai;
use Carbon\Carbon;

class GoalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $this->insertGoals();
    }

    private function insertGoals()
    {
        $sais = Sai::with(['service', 'activity', 'indicator'])->get();

        // Definir os anos específicos para inserção de metas
        $currentYear = 2023;   // Ano atual para metas aleatórias
        $nextYear = 2024;      // Próximo ano para metas a zero

        foreach ($sais as $sai) {
            // Inserir meta para o ano atual com valores aleatórios
            $this->createGoal($sai, $currentYear, $this->generateRandomTarget());

            // Inserir meta para o próximo ano com valor zero
            $this->createGoal($sai, $nextYear, $this->generateRandomTarget());
        }
    }

    private function createGoal($sai, $year, $target)
    {
        Goal::create([
            'sai_id' => $sai->id,
            'target_value' => $target,
            'year' => $year,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    private function generateRandomTarget()
    {
        return rand(10000, 50000); // Gera metas entre 10.000 e 50.000
    }
}
