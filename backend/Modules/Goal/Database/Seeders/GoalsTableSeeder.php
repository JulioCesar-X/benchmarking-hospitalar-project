<?php

namespace Modules\Goal\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Goal\Entities\Goal;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Illuminate\Support\Facades\Log;

class GoalsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->insertGoals();
    }

    private function insertGoals()
    {
        // Carregar todos os ServiceActivityIndicators com seus relacionamentos
        $serviceActivityIndicators = ServiceActivityIndicator::with(['service', 'activity', 'indicator'])->get();

        $years = range(date('Y') - 5, date('Y') - 1); // Últimos 5 anos

        foreach ($serviceActivityIndicators as $sai) {
            foreach ($years as $year) {
                $target = $this->generateRandomTarget(); // Gerar meta aleatória acima de 10.000

                Goal::create([
                    'service_activity_indicator_id' => $sai->id,
                    'target_value' => $target,
                    'year' => $year,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                Log::info("Goal created for SAI ID {$sai->id} for year $year with target $target");
            }
        }
    }

    private function generateRandomTarget()
    {
        $min = 10000;
        $max = 50000; // Você pode ajustar esse valor máximo conforme necessário
        return rand($min, $max);
    }
}