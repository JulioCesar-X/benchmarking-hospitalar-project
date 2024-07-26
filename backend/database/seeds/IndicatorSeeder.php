<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IndicatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $indicators = [
            ['id' => 1, 'indicator_name' => 'Nº Consultas Total', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'indicator_name' => 'Primeiras Consultas', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'indicator_name' => 'Consultas Subsequentes', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'indicator_name' => '% Primeiras Consultas / Total', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'indicator_name' => '% Consultas Marcadas e não Realizadas', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'indicator_name' => 'Encargos Globais', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'indicator_name' => 'Encargos / Consultas', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'indicator_name' => 'Encargo Consulta / Doente', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'indicator_name' => 'Nº de 1ªs Consultas Médicas', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'indicator_name' => 'Nº de Consultas Médicas Subsequentes', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'indicator_name' => 'N.º Total Consultas Médicas', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'indicator_name' => 'Lotação', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'indicator_name' => 'Demora Média', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 14, 'indicator_name' => 'Taxa de Ocupação', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 15, 'indicator_name' => 'Taxa de Reinternamento (30 dias)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 16, 'indicator_name' => 'Índice Case-Mix', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 17, 'indicator_name' => 'Doentes Saídos (Altas)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 18, 'indicator_name' => 'Doentes Saídos P/Cama', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 19, 'indicator_name' => 'Encargos (rubricas)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 20, 'indicator_name' => 'Encargos / Doentes Saídos', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 21, 'indicator_name' => 'Doentes de Psiquiatria no Exterior (Trofa Saúde)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 22, 'indicator_name' => 'Total dias de internamentos', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 23, 'indicator_name' => 'Preço de referência para diária (1)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 24, 'indicator_name' => 'Dias de Internamento (Totais) Doentes Crónicos', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 25, 'indicator_name' => 'Demora média Crónicos(HPA)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 26, 'indicator_name' => 'Demora média Crónicos (Santa Casa Misericórdia Amarante)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 27, 'indicator_name' => 'Doentes de Psiquiatria Crónicos (HPA)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 28, 'indicator_name' => 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 29, 'indicator_name' => 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 30, 'indicator_name' => 'Nº Sessões Total', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 31, 'indicator_name' => 'Nº Doentes', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 32, 'indicator_name' => 'Nº Sessões / Doente', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 34, 'indicator_name' => 'Encargos / Sessão', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 35, 'indicator_name' => 'Total de Visitas Domiciliárias', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 36, 'indicator_name' => 'Encargos / Visita', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 37, 'indicator_name' => 'Consultas Marcadas e não Realizadas', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 38, 'indicator_name' => 'Ocupação', 'created_at' => now(), 'updated_at' => now()],
        ];

        
        for ($i = 39; $i <= 44; $i++) {
            $indicators[] = [
                'id' => $i,
                'indicator_name' => 'indicator' . $i,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        DB::table('indicators')->insert($indicators);
    }
}