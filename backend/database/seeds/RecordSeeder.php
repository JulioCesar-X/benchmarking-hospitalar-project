<?php

use Illuminate\Database\Seeder;
use App\Record;
use App\Sai;
use Carbon\Carbon;

class RecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $this->insertRecords();
    }

    private function insertRecords()
    {
        $sais = Sai::with(['service', 'activity', 'indicator'])->get();

        $currentYear = [2020,2021,2022,2023,2024];

        foreach($currentYear as $year){
            foreach ($sais as $sai) {
                // Inserir dados para o ano atual com valores aleatórios
                $this->insertYearlyRecords($sai, $year, true);
            }
        }
    }

    private function insertYearlyRecords($sais, $year, $isZero)
    {
        foreach ($sais as $sai) {
            for ($month = 1; $month <= 12; $month++) {
                $date = Carbon::create($year, $month, 1)->format('Y-m-d');
                $value = $isZero ? 0 : $this->generateRandomValue($sai->indicator->indicator_name);

                Record::create([
                    'sai_id' => $sai->id,
                    'date' => $date,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }

    private function generateRandomValue($indicatorName)
    {
        // Definição de intervalos de valores baseados no nome do indicador
        $ranges = [
            'Nº Consultas Total' => ['min' => 200, 'max' => 1000],
            'Primeiras Consultas' => ['min' => 50, 'max' => 300],
            'Consultas Subsequentes' => ['min' => 100, 'max' => 800],
            // Adicione outros indicadores conforme necessário
            'default' => ['min' => 150, 'max' => 1000] // Valor padrão
        ];
        $range = $ranges[$indicatorName] ?? $ranges['default'];
        return rand($range['min'], $range['max']);
    }
}