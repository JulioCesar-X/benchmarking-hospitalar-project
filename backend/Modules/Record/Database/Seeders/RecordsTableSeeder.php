<?php

namespace Modules\Record\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Record\Entities\Record;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class RecordsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->insertRecords();
    }

    private function insertRecords()
    {
        // Carregar todos os ServiceActivityIndicators com seus relacionamentos
        $serviceActivityIndicators = ServiceActivityIndicator::with(['service', 'activity', 'indicator'])->get();

        // Anos para os registros
        $years = range(date('Y') - 5, date('Y') - 1); // Últimos 5 anos
        $specialYear = 2024; // Ano especial com valores zero

        foreach ($serviceActivityIndicators as $sai) {
            // Inserir registros para os últimos 5 anos
            foreach ($years as $year) {
                for ($month = 1; $month <= 12; $month++) {
                    $date = Carbon::create($year, $month, 1)->format('Y-m-d');
                    $value = $this->generateRandomValue($sai->indicator->indicator_name); // Gerar valor aleatório baseado no indicador

                    Record::create([
                        'service_activity_indicator_id' => $sai->id,
                        'date' => $date,
                        'value' => $value,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    Log::info("Record created for SAI ID {$sai->id} on date $date with value $value");
                }
            }

            // Inserir registros com valor zero para 2024
            for ($month = 1; $month <= 12; $month++) {
                $date = Carbon::create($specialYear, $month, 1)->format('Y-m-d');
                $value = 0; // Valor zero

                Record::create([
                    'service_activity_indicator_id' => $sai->id,
                    'date' => $date,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                Log::info("Record created for SAI ID {$sai->id} on date $date with value $value (special year)");
            }
        }
    }

    private function generateRandomValue($indicatorName)
    {
        // Definir intervalos de valores baseados no nome do indicador
        switch ($indicatorName) {
            case 'Nº Consultas Total':
                $min = 200;
                $max = 1000;
                break;
            case 'Primeiras Consultas':
                $min = 50;
                $max = 300;
                break;
            case 'Consultas Subsequentes':
                $min = 100;
                $max = 800;
                break;
                // Adicionar outros casos conforme necessário
            default:
                $min = 150;
                $max = 1000;
                break;
        }
        return rand($min, $max);
    }
}
