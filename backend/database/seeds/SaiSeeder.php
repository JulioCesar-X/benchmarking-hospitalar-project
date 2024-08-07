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
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 1, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 2, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 3, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 37, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 4,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 5,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 6,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 7,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 8,  'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Consulta Externa e Psiquiatria Infância e Adolescência
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 1, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 2, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 3, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 37, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 4,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 5,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 6,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 7,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 8,  'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Consulta Externa e Quadro Resumo
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 9, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 10, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 11, 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Internamento Agudos
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 12, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 13, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 14,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 38, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 15,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 16,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 17, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 18,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 19,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 20,  'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Internamento Trofa Saúde
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 21, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 22, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 23,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 20,  'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Internamento Crónicos
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 24, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 25, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 26, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 27, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 28, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 29, 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Hospital Dia
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 30, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 31, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 32,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 34,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 6,  'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Serviço Domiciliário
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 35, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 6,  'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 36,  'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Associações para Análise e Diagnóstico Avançado
            ['service_id' => 7, 'activity_id' => 4, 'indicator_id' => 39, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 7, 'activity_id' => 4, 'indicator_id' => 40, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 7, 'activity_id' => 5, 'indicator_id' => 41, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 7, 'activity_id' => 5, 'indicator_id' => 42, 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Associações para Cuidado Compassivo ao Paciente
            ['service_id' => 8, 'activity_id' => 6, 'indicator_id' => 43, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 8, 'activity_id' => 6, 'indicator_id' => 44, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 8, 'activity_id' => 7, 'indicator_id' => 39, 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Associações para Consulta Especializada em Saúde
            ['service_id' => 9, 'activity_id' => 8, 'indicator_id' => 40, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 9, 'activity_id' => 8, 'indicator_id' => 41, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 9, 'activity_id' => 9, 'indicator_id' => 42, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 9, 'activity_id' => 9, 'indicator_id' => 43, 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Associações para Formação e Educação Continuada
            ['service_id' => 10, 'activity_id' => 8, 'indicator_id' => 44, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 10, 'activity_id' => 9, 'indicator_id' => 39, 'created_at' => $timestamp, 'updated_at' => $timestamp],

            // Associações para Recursos de Saúde Digital
            ['service_id' => 11, 'activity_id' => 9, 'indicator_id' => 40, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 11, 'activity_id' => 8, 'indicator_id' => 41, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['service_id' => 11, 'activity_id' => 9, 'indicator_id' => 42, 'created_at' => $timestamp, 'updated_at' => $timestamp],
        ];
    }
}