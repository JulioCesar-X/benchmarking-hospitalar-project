<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $timestamp = Carbon::now();
        $sais = $this->generateInitialSais($timestamp);
        $sais = array_merge($sais, $this->generateAdditionalSais($timestamp));

        DB::transaction(function () use ($sais) {
            DB::table('sais')->insert($sais);
        });
    }

    /**
     * Gera os dados iniciais para a inserção.
     *
     * @param \Carbon\Carbon $timestamp
     * @return array
     */
    private function generateInitialSais($timestamp)
    {
        return [
            // Consulta Externa e Psiquiatria Adultos
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 1, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 2, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 3, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 37, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 4, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 5, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 6, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 7, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 8, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Consulta Externa e Psiquiatria Infância e Adolescência
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 1, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 2, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 3, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 37, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 4, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 5, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 6, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 7, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 8, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Consulta Externa e Quadro Resumo
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 9, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 10, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 11, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Internamento Agudos
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 12, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 13, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 14, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 38, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 15, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 16, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 17, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 18, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 19, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 20, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Internamento Trofa Saúde
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 21, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 22, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 23, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 20, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Internamento Crónicos
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 24, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 25, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 26, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 27, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 28, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 29, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Hospital Dia
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 30, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 31, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 32, 'type' => 'desempenho', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 34, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 6, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Serviço Domiciliário
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 35, 'type' => 'produção', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 6, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 36, 'type' => 'financeiro', 'created_at' => $timestamp, 'updated_at' => $timestamp],
        ];
    }

    /**
     * Gera os dados adicionais dinâmicos para a inserção.
     *
     * @param \Carbon\Carbon $timestamp
     * @return array
     */
    private function generateAdditionalSais($timestamp)
    {
        $additionalSais = [];
        for ($service_id = 7; $service_id <= 11; $service_id++) {
            for ($activity_id = 4; $activity_id <= 9; $activity_id++) {
                for ($indicator_id = 39; $indicator_id <= 44; $indicator_id++) {
                    $additionalSais[] = [
                        'service_id' => $service_id,
                        'activity_id' => $activity_id,
                        'indicator_id' => $indicator_id,
                        'type' => 'produção',
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp
                    ];
                }
            }
        }
        return $additionalSais;
    }
}