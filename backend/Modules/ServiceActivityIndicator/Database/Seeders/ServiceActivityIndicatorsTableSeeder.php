<?php

namespace Modules\ServiceActivityIndicator\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceActivityIndicatorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $serviceActivityIndicators = [
            // Consulta Externa e Psiquiatria Adultos
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 1, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 2, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 3, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 37, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 4, 'type' => 'desempenho'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 5, 'type' => 'desempenho'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 6, 'type' => 'financeiro'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 7, 'type' => 'financeiro'],
            ['service_id' => 1, 'activity_id' => 1, 'indicator_id' => 8, 'type' => 'financeiro'],

            // Consulta Externa e Psiquiatria Infância e Adolescência
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 1, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 2, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 3, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 37, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 4, 'type' => 'desempenho'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 5, 'type' => 'desempenho'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 6, 'type' => 'financeiro'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 7, 'type' => 'financeiro'],
            ['service_id' => 1, 'activity_id' => 2, 'indicator_id' => 8, 'type' => 'financeiro'],

            // Consulta Externa e Quadro Resumo
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 9, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 10, 'type' => 'produção'],
            ['service_id' => 1, 'activity_id' => 3, 'indicator_id' => 11, 'type' => 'produção'],

            // Internamento Agudos
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 12, 'type' => 'produção'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 13, 'type' => 'produção'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 14, 'type' => 'desempenho'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 38, 'type' => 'produção'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 15, 'type' => 'desempenho'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 16, 'type' => 'desempenho'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 17, 'type' => 'produção'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 18, 'type' => 'desempenho'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 19, 'type' => 'financeiro'],
            ['service_id' => 2, 'activity_id' => null, 'indicator_id' => 20, 'type' => 'financeiro'],

            // Internamento Trofa Saúde
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 21, 'type' => 'produção'],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 22, 'type' => 'produção'],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 23, 'type' => 'financeiro'],
            ['service_id' => 3, 'activity_id' => null, 'indicator_id' => 20, 'type' => 'financeiro'],

            // Internamento Crónicos
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 24, 'type' => 'produção'],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 25, 'type' => 'produção'],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 26, 'type' => 'produção'],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 27, 'type' => 'produção'],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 28, 'type' => 'produção'],
            ['service_id' => 4, 'activity_id' => null, 'indicator_id' => 29, 'type' => 'produção'],

            // Hospital Dia
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 30, 'type' => 'produção'],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 31, 'type' => 'produção'],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 32, 'type' => 'desempenho'],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 34, 'type' => 'financeiro'],
            ['service_id' => 5, 'activity_id' => null, 'indicator_id' => 6, 'type' => 'financeiro'],

            // Serviço Domiciliário
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 35, 'type' => 'produção'],
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 6, 'type' => 'financeiro'],
            ['service_id' => 6, 'activity_id' => null, 'indicator_id' => 36, 'type' => 'financeiro']
        ];

        foreach ($serviceActivityIndicators as $sai) {
            DB::table('service_activity_indicators')->insert($sai);
        }

    }
}
