<?php

use Illuminate\Database\Seeder;
use App\Goal;
use App\Sai;

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
        $currentYears = [2019,2020,2021,2022,2023,2024];

        foreach ($currentYears as $year) {
            foreach ($sais as $sai) {
                if ($sai) {
                    $this->createGoal($sai, $year, $this->generateRandomTarget());
                }
            }
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
        return rand(25000, 50000);
    }
}