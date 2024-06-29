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

        $years = range(date('Y') - 5, date('Y') - 1); // Últimos 5 anos

        foreach ($serviceActivityIndicators as $sai) {
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
// namespace Modules\Record\Database\Seeders;

// use Illuminate\Database\Seeder;
// use Illuminate\Support\Facades\DB;
// use Carbon\Carbon;
// use Illuminate\Support\Facades\Log;

// class RecordsTableSeeder extends Seeder
// {
//     /**
//      * Run the database seeds.
//      *
//      * @return void
//      */
//     public function run()
//     {
//         // Criando o mapa de IDs para ServiceActivityIndicators
//         $saiMap = $this->createSaiMap();

//         $this->insertRecordsForPsiquiatriaAdultos($saiMap);
//         $this->insertRecordsForPsiquiatriaInfanciaAdolescencia($saiMap);
//         $this->insertRecordsForQuadroResumo($saiMap);
//         $this->insertRecordsForInternamentoAgudos($saiMap);
//         $this->insertRecordsForInternamentoTrofaSaude($saiMap);
//         $this->insertRecordsForInternamentoCronicos($saiMap);
//         $this->insertRecordsForHospitalDia($saiMap);
//         $this->insertRecordsForServicoDomiciliario($saiMap);
//     }
//     private function createSaiMap()
//     {
//         return DB::table('service_activity_indicators')
//             ->join('services', 'services.id', '=', 'service_activity_indicators.service_id')
//             ->join('activities', 'activities.id', '=', 'service_activity_indicators.activity_id', 'left outer')
//             ->join('indicators', 'indicators.id', '=', 'service_activity_indicators.indicator_id')
//             ->select(
//                 'service_activity_indicators.id',
//                 'services.service_name',
//                 'activities.activity_name',
//                 'indicators.indicator_name'
//             )
//             ->get()
//             ->mapWithKeys(function ($item) {
//                 // Criar uma chave única combinando serviço, atividade e indicador
//                 $activityName = $item->activity_name ?? 'None';  // Lidar com atividades possivelmente nulas
//                 return [$item->service_name . '|' . $activityName . '|' . $item->indicator_name => $item->id];
//             });
//     }

//     private function insertRecordsForPsiquiatriaAdultos($saiMap)
//     {
//         $serviceName = 'Consulta Externa';
//         $activityName = 'Psiquiatria Adultos';

//         $datesValues = [
//             '2023-01-31' => [
//                 'Primeiras Consultas' => 500,
//                 'Consultas Subsequentes' => 5000,
//                 'Consultas Marcadas e não Realizadas' => 633,
//                 'Encargos Globais' => 0,
//                 'Encargos / Consultas' => 0,
//                 'Encargo Consulta / Doente' => 0
//             ],
//             '2023-02-28' => [
//                 'Primeiras Consultas' => 606,
//                 'Consultas Subsequentes' => 355,
//                 'Consultas Marcadas e não Realizadas' => 633,
//                 'Encargos Globais' => 0,
//                 'Encargos / Consultas' => 0,
//                 'Encargo Consulta / Doente' => 0
//             ],
//             '2024-01-31' => [
//                 'Primeiras Consultas' => 509,
//                 'Consultas Subsequentes' => 5000,
//                 'Consultas Marcadas e não Realizadas' => 600,
//                 'Encargos Globais' => 0,
//                 'Encargos / Consultas' => 0,
//                 'Encargo Consulta / Doente' => 0
//             ],
//             '2024-02-28' => [
//                 'Primeiras Consultas' => 500,
//                 'Consultas Subsequentes' => 162,
//                 'Consultas Marcadas e não Realizadas' => 600,
//                 'Encargos Globais' => 0,
//                 'Encargos / Consultas' => 0,
//                 'Encargo Consulta / Doente' => 0
//             ],
//         ];

//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . $activityName . '|' . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Assume a default of null if the key does not exist

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 }
//             }
//         }
//     }
//     private function insertRecordsForPsiquiatriaInfanciaAdolescencia($saiMap)
//     {
//         $serviceName = 'Consulta Externa';
//         $activityName = 'Psiquiatria Infância e Adolescência';

//         $datesValues = [
//             // 2019
//             '2019-01-31' => [
//                 'Primeiras Consultas' => 150,
//                 'Consultas Subsequentes' => 300,
//                 'Consultas Marcadas e não Realizadas' => 75,
//             ],
//             '2019-02-28' => [
//                 'Primeiras Consultas' => 160,
//                 'Consultas Subsequentes' => 310,
//                 'Consultas Marcadas e não Realizadas' => 80,
//             ],
//             '2019-03-31' => [
//                 'Primeiras Consultas' => 170,
//                 'Consultas Subsequentes' => 320,
//                 'Consultas Marcadas e não Realizadas' => 85,
//             ],
//             '2019-04-30' => [
//                 'Primeiras Consultas' => 180,
//                 'Consultas Subsequentes' => 330,
//                 'Consultas Marcadas e não Realizadas' => 90,
//             ],
//             '2019-05-31' => [
//                 'Primeiras Consultas' => 190,
//                 'Consultas Subsequentes' => 340,
//                 'Consultas Marcadas e não Realizadas' => 95,
//             ],
//             '2019-06-30' => [
//                 'Primeiras Consultas' => 200,
//                 'Consultas Subsequentes' => 350,
//                 'Consultas Marcadas e não Realizadas' => 100,
//             ],
//             '2019-07-31' => [
//                 'Primeiras Consultas' => 210,
//                 'Consultas Subsequentes' => 360,
//                 'Consultas Marcadas e não Realizadas' => 105,
//             ],
//             '2019-08-31' => [
//                 'Primeiras Consultas' => 220,
//                 'Consultas Subsequentes' => 370,
//                 'Consultas Marcadas e não Realizadas' => 110,
//             ],
//             '2019-09-30' => [
//                 'Primeiras Consultas' => 230,
//                 'Consultas Subsequentes' => 380,
//                 'Consultas Marcadas e não Realizadas' => 115,
//             ],
//             '2019-10-31' => [
//                 'Primeiras Consultas' => 240,
//                 'Consultas Subsequentes' => 390,
//                 'Consultas Marcadas e não Realizadas' => 120,
//             ],
//             '2019-11-30' => [
//                 'Primeiras Consultas' => 250,
//                 'Consultas Subsequentes' => 400,
//                 'Consultas Marcadas e não Realizadas' => 125,
//             ],
//             '2019-12-31' => [
//                 'Primeiras Consultas' => 260,
//                 'Consultas Subsequentes' => 410,
//                 'Consultas Marcadas e não Realizadas' => 130,
//             ],
//             // 2020
//             '2020-01-31' => [
//                 'Primeiras Consultas' => 270,
//                 'Consultas Subsequentes' => 420,
//                 'Consultas Marcadas e não Realizadas' => 135,
//             ],
//             '2020-02-29' => [
//                 'Primeiras Consultas' => 280,
//                 'Consultas Subsequentes' => 430,
//                 'Consultas Marcadas e não Realizadas' => 140,
//             ],
//             '2020-03-31' => [
//                 'Primeiras Consultas' => 290,
//                 'Consultas Subsequentes' => 440,
//                 'Consultas Marcadas e não Realizadas' => 145,
//             ],
//             '2020-04-30' => [
//                 'Primeiras Consultas' => 300,
//                 'Consultas Subsequentes' => 450,
//                 'Consultas Marcadas e não Realizadas' => 150,
//             ],
//             '2020-05-31' => [
//                 'Primeiras Consultas' => 310,
//                 'Consultas Subsequentes' => 460,
//                 'Consultas Marcadas e não Realizadas' => 155,
//             ],
//             '2020-06-30' => [
//                 'Primeiras Consultas' => 320,
//                 'Consultas Subsequentes' => 470,
//                 'Consultas Marcadas e não Realizadas' => 160,
//             ],
//             '2020-07-31' => [
//                 'Primeiras Consultas' => 330,
//                 'Consultas Subsequentes' => 480,
//                 'Consultas Marcadas e não Realizadas' => 165,
//             ],
//             '2020-08-31' => [
//                 'Primeiras Consultas' => 340,
//                 'Consultas Subsequentes' => 490,
//                 'Consultas Marcadas e não Realizadas' => 170,
//             ],
//             '2020-09-30' => [
//                 'Primeiras Consultas' => 350,
//                 'Consultas Subsequentes' => 500,
//                 'Consultas Marcadas e não Realizadas' => 175,
//             ],
//             '2020-10-31' => [
//                 'Primeiras Consultas' => 360,
//                 'Consultas Subsequentes' => 510,
//                 'Consultas Marcadas e não Realizadas' => 180,
//             ],
//             '2020-11-30' => [
//                 'Primeiras Consultas' => 370,
//                 'Consultas Subsequentes' => 520,
//                 'Consultas Marcadas e não Realizadas' => 185,
//             ],
//             '2020-12-31' => [
//                 'Primeiras Consultas' => 380,
//                 'Consultas Subsequentes' => 530,
//                 'Consultas Marcadas e não Realizadas' => 190,
//             ],
//             // 2021
//             '2021-01-31' => [
//                 'Primeiras Consultas' => 390,
//                 'Consultas Subsequentes' => 540,
//                 'Consultas Marcadas e não Realizadas' => 195,
//             ],
//             '2021-02-28' => [
//                 'Primeiras Consultas' => 400,
//                 'Consultas Subsequentes' => 550,
//                 'Consultas Marcadas e não Realizadas' => 200,
//             ],
//             '2021-03-31' => [
//                 'Primeiras Consultas' => 410,
//                 'Consultas Subsequentes' => 560,
//                 'Consultas Marcadas e não Realizadas' => 205,
//             ],
//             '2021-04-30' => [
//                 'Primeiras Consultas' => 420,
//                 'Consultas Subsequentes' => 570,
//                 'Consultas Marcadas e não Realizadas' => 210,
//             ],
//             '2021-05-31' => [
//                 'Primeiras Consultas' => 430,
//                 'Consultas Subsequentes' => 580,
//                 'Consultas Marcadas e não Realizadas' => 215,
//             ],
//             '2021-06-30' => [
//                 'Primeiras Consultas' => 440,
//                 'Consultas Subsequentes' => 590,
//                 'Consultas Marcadas e não Realizadas' => 220,
//             ],
//             '2021-07-31' => [
//                 'Primeiras Consultas' => 450,
//                 'Consultas Subsequentes' => 600,
//                 'Consultas Marcadas e não Realizadas' => 225,
//             ],
//             '2021-08-31' => [
//                 'Primeiras Consultas' => 460,
//                 'Consultas Subsequentes' => 610,
//                 'Consultas Marcadas e não Realizadas' => 230,
//             ],
//             '2021-09-30' => [
//                 'Primeiras Consultas' => 470,
//                 'Consultas Subsequentes' => 620,
//                 'Consultas Marcadas e não Realizadas' => 235,
//             ],
//             '2021-10-31' => [
//                 'Primeiras Consultas' => 480,
//                 'Consultas Subsequentes' => 630,
//                 'Consultas Marcadas e não Realizadas' => 240,
//             ],
//             '2021-11-30' => [
//                 'Primeiras Consultas' => 490,
//                 'Consultas Subsequentes' => 640,
//                 'Consultas Marcadas e não Realizadas' => 245,
//             ],
//             '2021-12-31' => [
//                 'Primeiras Consultas' => 500,
//                 'Consultas Subsequentes' => 650,
//                 'Consultas Marcadas e não Realizadas' => 250,
//             ],
//             // 2022
//             '2022-01-31' => [
//                 'Primeiras Consultas' => 510,
//                 'Consultas Subsequentes' => 660,
//                 'Consultas Marcadas e não Realizadas' => 255,
//             ],
//             '2022-02-28' => [
//                 'Primeiras Consultas' => 520,
//                 'Consultas Subsequentes' => 670,
//                 'Consultas Marcadas e não Realizadas' => 260,
//             ],
//             '2022-03-31' => [
//                 'Primeiras Consultas' => 530,
//                 'Consultas Subsequentes' => 680,
//                 'Consultas Marcadas e não Realizadas' => 265,
//             ],
//             '2022-04-30' => [
//                 'Primeiras Consultas' => 540,
//                 'Consultas Subsequentes' => 690,
//                 'Consultas Marcadas e não Realizadas' => 270,
//             ],
//             '2022-05-31' => [
//                 'Primeiras Consultas' => 550,
//                 'Consultas Subsequentes' => 700,
//                 'Consultas Marcadas e não Realizadas' => 275,
//             ],
//             '2022-06-30' => [
//                 'Primeiras Consultas' => 560,
//                 'Consultas Subsequentes' => 710,
//                 'Consultas Marcadas e não Realizadas' => 280,
//             ],
//             '2022-07-31' => [
//                 'Primeiras Consultas' => 570,
//                 'Consultas Subsequentes' => 720,
//                 'Consultas Marcadas e não Realizadas' => 285,
//             ],
//             '2022-08-31' => [
//                 'Primeiras Consultas' => 580,
//                 'Consultas Subsequentes' => 730,
//                 'Consultas Marcadas e não Realizadas' => 290,
//             ],
//             '2022-09-30' => [
//                 'Primeiras Consultas' => 590,
//                 'Consultas Subsequentes' => 740,
//                 'Consultas Marcadas e não Realizadas' => 295,
//             ],
//             '2022-10-31' => [
//                 'Primeiras Consultas' => 600,
//                 'Consultas Subsequentes' => 750,
//                 'Consultas Marcadas e não Realizadas' => 300,
//             ],
//             '2022-11-30' => [
//                 'Primeiras Consultas' => 610,
//                 'Consultas Subsequentes' => 760,
//                 'Consultas Marcadas e não Realizadas' => 305,
//             ],
//             '2022-12-31' => [
//                 'Primeiras Consultas' => 620,
//                 'Consultas Subsequentes' => 770,
//                 'Consultas Marcadas e não Realizadas' => 310,
//             ],
//             '2023-01-31' => [
//                 'Primeiras Consultas' => 275,
//                 'Consultas Subsequentes' => 500,
//                 'Consultas Marcadas e não Realizadas' => 286,
//             ],
//             '2023-02-28' => [
//                 'Primeiras Consultas' => 300,
//                 'Consultas Subsequentes' => 496,
//                 'Consultas Marcadas e não Realizadas' => 100,
//             ],
//             '2023-03-31' => [
//                 'Primeiras Consultas' => 310,
//                 'Consultas Subsequentes' => 510,
//                 'Consultas Marcadas e não Realizadas' => 120,
//             ],
//             '2023-04-30' => [
//                 'Primeiras Consultas' => 320,
//                 'Consultas Subsequentes' => 520,
//                 'Consultas Marcadas e não Realizadas' => 130,
//             ],
//             '2023-05-31' => [
//                 'Primeiras Consultas' => 330,
//                 'Consultas Subsequentes' => 530,
//                 'Consultas Marcadas e não Realizadas' => 140,
//             ],
//             '2023-06-30' => [
//                 'Primeiras Consultas' => 340,
//                 'Consultas Subsequentes' => 540,
//                 'Consultas Marcadas e não Realizadas' => 150,
//             ],
//             '2023-07-31' => [
//                 'Primeiras Consultas' => 350,
//                 'Consultas Subsequentes' => 550,
//                 'Consultas Marcadas e não Realizadas' => 160,
//             ],
//             '2023-08-31' => [
//                 'Primeiras Consultas' => 360,
//                 'Consultas Subsequentes' => 560,
//                 'Consultas Marcadas e não Realizadas' => 170,
//             ],
//             '2023-09-30' => [
//                 'Primeiras Consultas' => 370,
//                 'Consultas Subsequentes' => 570,
//                 'Consultas Marcadas e não Realizadas' => 180,
//             ],
//             '2023-10-31' => [
//                 'Primeiras Consultas' => 380,
//                 'Consultas Subsequentes' => 580,
//                 'Consultas Marcadas e não Realizadas' => 190,
//             ],
//             '2023-11-30' => [
//                 'Primeiras Consultas' => 390,
//                 'Consultas Subsequentes' => 590,
//                 'Consultas Marcadas e não Realizadas' => 200,
//             ],
//             '2023-12-31' => [
//                 'Primeiras Consultas' => 400,
//                 'Consultas Subsequentes' => 600,
//                 'Consultas Marcadas e não Realizadas' => 210,
//             ],
//             '2024-01-31' => [
//                 'Primeiras Consultas' => 244,
//                 'Consultas Subsequentes' => 500,
//                 'Consultas Marcadas e não Realizadas' => 286,
//             ],
//             '2024-02-28' => [
//                 'Primeiras Consultas' => 200,
//                 'Consultas Subsequentes' => 699,
//                 'Consultas Marcadas e não Realizadas' => 100,
//             ],
//             '2024-03-31' => [
//                 'Primeiras Consultas' => 310,
//                 'Consultas Subsequentes' => 510,
//                 'Consultas Marcadas e não Realizadas' => 120,
//             ],
//             '2024-04-30' => [
//                 'Primeiras Consultas' => 320,
//                 'Consultas Subsequentes' => 520,
//                 'Consultas Marcadas e não Realizadas' => 130,
//             ],
//             '2024-05-31' => [
//                 'Primeiras Consultas' => 330,
//                 'Consultas Subsequentes' => 530,
//                 'Consultas Marcadas e não Realizadas' => 140,
//             ],
//             '2024-06-30' => [
//                 'Primeiras Consultas' => 340,
//                 'Consultas Subsequentes' => 540,
//                 'Consultas Marcadas e não Realizadas' => 150,
//             ],
//             '2024-07-31' => [
//                 'Primeiras Consultas' => 350,
//                 'Consultas Subsequentes' => 550,
//                 'Consultas Marcadas e não Realizadas' => 160,
//             ],
//             '2024-08-31' => [
//                 'Primeiras Consultas' => 360,
//                 'Consultas Subsequentes' => 560,
//                 'Consultas Marcadas e não Realizadas' => 170,
//             ],
//             '2024-09-30' => [
//                 'Primeiras Consultas' => 370,
//                 'Consultas Subsequentes' => 570,
//                 'Consultas Marcadas e não Realizadas' => 180,
//             ],
//             '2024-10-31' => [
//                 'Primeiras Consultas' => 380,
//                 'Consultas Subsequentes' => 580,
//                 'Consultas Marcadas e não Realizadas' => 190,
//             ],
//             '2024-11-30' => [
//                 'Primeiras Consultas' => 390,
//                 'Consultas Subsequentes' => 590,
//                 'Consultas Marcadas e não Realizadas' => 200,
//             ],
//             '2024-12-31' => [
//                 'Primeiras Consultas' => 400,
//                 'Consultas Subsequentes' => 600,
//                 'Consultas Marcadas e não Realizadas' => 210,
//             ],
//         ];


//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . $activityName . '|' . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Check if the key exists in the map and retrieve the ID

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 } else {
//                     // Log or handle cases where no matching SAI ID was found
//                     Log::warning("No SAI ID found for key: $key");
//                 }
//             }
//         }
//     }
//     private function insertRecordsForQuadroResumo($saiMap)
//     {
//         $serviceName = 'Consulta Externa';
//         $activityName = 'Quadro Resumo';

//         $datesValues = [
//             '2023-01-31' => [
//                 'Nº de 1ªs Consultas Médicas' => 681,
//                 'Nº de Consultas Médicas Subsequentes' => 6000,
//             ],
//             '2023-02-28' => [
//                 'Nº de 1ªs Consultas Médicas' => 1000,
//                 'Nº de Consultas Médicas Subsequentes' => 351,
//             ],
//             '2024-01-31' => [
//                 'Nº de 1ªs Consultas Médicas' => 453,
//                 'Nº de Consultas Médicas Subsequentes' => 6000,
//             ],
//             '2024-02-28' => [
//                 'Nº de 1ªs Consultas Médicas' => 1000,
//                 'Nº de Consultas Médicas Subsequentes' => 361,
//             ],
//         ];

//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . $activityName . '|' . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 } else {
//                     // Log or handle cases where no matching SAI ID was found
//                     Log::warning("No SAI ID found for key: $key");
//                 }
//             }
//         }
//     }

//     private function insertRecordsForInternamentoAgudos($saiMap)
//     {
//         $serviceName = 'Internamento Agudos';
//         $activityName = null; // No specific activity for Internamento Agudos

//         $datesValues = [
//             '2023-01-31' => [
//                 'Lotação' => 21,
//                 'Demora Média' => 10,
//                 'Ocupacão' => 28,
//                 'Taxa de Reinternamento (30 dias)' => 1.5,
//                 'Índice Case-Mix' => 0,
//                 'Doentes Saídos (Altas)' => 66,
//                 'Doentes Saídos P/Cama' => 1.6,
//                 'Encargos (rubricas)' => 0,
//                 'Encargos / Doentes Saídos' => 0,
//             ],
//             '2023-02-28' => [
//                 'Lotação' => 20,
//                 'Demora Média' => 7.8,
//                 'Ocupacão' => 10,
//                 'Taxa de Reinternamento (30 dias)' => 6,
//                 'Índice Case-Mix' => 0,
//                 'Doentes Saídos (Altas)' => 0,
//                 'Doentes Saídos P/Cama' => 0,
//                 'Encargos (rubricas)' => 0,
//                 'Encargos / Doentes Saídos' => 0,
//             ],
//         ];

//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 } else {
//                     // Log or handle cases where no matching SAI ID was found
//                     Log::warning("No SAI ID found for key: $key");
//                 }
//             }
//         }
//     }
//     private function insertRecordsForInternamentoTrofaSaude($saiMap)
//     {
//         $serviceName = 'Internamento Trofa Saúde';
//         $activityName = null; // No specific activity for Internamento Trofa Saúde

//         $datesValues = [
//             '2023-01-31' => [
//                 'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 2,
//                 'Total dias de internamentos' => 57,
//                 'Preço de referência para diária (1)' => 89.00,
//                 'Encargos / Doentes Saídos' => 9333.00,
//             ],
//             '2023-02-28' => [
//                 'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 2,
//                 'Total dias de internamentos' => 40,
//                 'Preço de referência para diária (1)' => 100,
//                 'Encargos / Doentes Saídos' => 9000.00,
//             ],
//             '2024-01-31' => [
//                 'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 22,
//                 'Total dias de internamentos' => 676,
//                 'Preço de referência para diária (1)' => 115.00,
//                 'Encargos / Doentes Saídos' => 0,
//             ],
//             '2024-02-28' => [
//                 'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 100,
//                 'Total dias de internamentos' => 2000,
//                 'Preço de referência para diária (1)' => 100.00,
//                 'Encargos / Doentes Saídos' => 0,
//             ],
//         ];

//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 } else {
//                     // Log or handle cases where no matching SAI ID was found
//                     Log::warning("No SAI ID found for key: $key");
//                 }
//             }
//         }
//     }
//     private function insertRecordsForInternamentoCronicos($saiMap)
//     {
//         $serviceName = 'Internamento Crónicos';
//         $activityName = null; // No specific activity for Internamento Crónicos

//         $datesValues = [
//             '2023-01-31' => [
//                 'Dias de Internamento (Totais) Doentes Crónicos' => 500,
//                 'Demora média Crónicos(HPA)' => 38,
//                 'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 0,
//                 'Doentes de Psiquiatria Crónicos (HPA)' => 4,
//                 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 10,
//                 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
//             ],
//             '2023-02-28' => [
//                 'Dias de Internamento (Totais) Doentes Crónicos' => 533,
//                 'Demora média Crónicos(HPA)' => 100,
//                 'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 2,
//                 'Doentes de Psiquiatria Crónicos (HPA)' => 3,
//                 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 13,
//                 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
//             ],
//             '2024-01-31' => [
//                 'Dias de Internamento (Totais) Doentes Crónicos' => 1000,
//                 'Demora média Crónicos(HPA)' => 40,
//                 'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 2,
//                 'Doentes de Psiquiatria Crónicos (HPA)' => 4,
//                 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 10,
//                 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
//             ],
//             '2024-02-28' => [
//                 'Dias de Internamento (Totais) Doentes Crónicos' => 1203,
//                 'Demora média Crónicos(HPA)' => 35,
//                 'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 0,
//                 'Doentes de Psiquiatria Crónicos (HPA)' => 2,
//                 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 13,
//                 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
//             ],
//         ];

//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 } else {
//                     // Log or handle cases where no matching SAI ID was found
//                     Log::warning("No SAI ID found for key: $key");
//                 }
//             }
//         }
//     }

//     private function insertRecordsForHospitalDia($saiMap)
//     {
//         $serviceName = 'Hospital Dia';
//         $activityName = null; // Null since Hospital Dia does not relate to a specific activity

//         $datesValues = [
//             '2023-01-31' => [
//                 'Nº Sessões Total' => 1700,
//                 'Nº Doentes' => 500,
//                 'Encargos Globais' => 0,
//                 'Encargos/Sessão' => 0
//             ],
//             '2023-02-28' => [
//                 'Nº Sessões Total' => 1000,
//                 'Nº Doentes' => 601,
//                 'Encargos Globais' => 0,
//                 'Encargos/Sessão' => 0
//             ],
//             '2024-01-31' => [
//                 'Nº Sessões Total' => 1500,
//                 'Nº Doentes' => 500,
//                 'Encargos Globais' => 0,
//                 'Encargos/Sessão' => 0
//             ],
//             '2024-02-28' => [
//                 'Nº Sessões Total' => 1000,
//                 'Nº Doentes' => 512,
//                 'Encargos Globais' => 0,
//                 'Encargos/Sessão' => 0
//             ],
//         ];

//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 } else {
//                     // Log or handle cases where no matching SAI ID was found
//                     Log::warning("No SAI ID found for key: $key");
//                 }
//             }
//         }
//     }

//     private function insertRecordsForServicoDomiciliario($saiMap)
//     {
//         $serviceName = 'Serviço Domiciliário';
//         $activityName = null; // Null since Serviço Domiciliário does not relate to a specific activity

//         $datesValues = [
//             '2023-01-31' => [
//                 'Total de Visitas Domiciliárias' => 187,
//                 'Encargos Globais' => 0,
//                 'Encargos/Visita' => 0
//             ],
//             '2023-02-28' => [
//                 'Total de Visitas Domiciliárias' => 1000,
//                 'Encargos Globais' => 0,
//                 'Encargos/Visita' => 0
//             ],
//             '2024-01-31' => [
//                 'Total de Visitas Domiciliárias' => 171,
//                 'Encargos Globais' => 0,
//                 'Encargos/Visita' => 0
//             ],
//             '2024-02-28' => [
//                 'Total de Visitas Domiciliárias' => 1000,
//                 'Encargos Globais' => 0,
//                 'Encargos/Visita' => 0
//             ],
//         ];

//         foreach ($datesValues as $date => $values) {
//             foreach ($values as $indicatorName => $value) {
//                 $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
//                 $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

//                 if ($saiId) {
//                     DB::table('records')->insert([
//                         'service_activity_indicator_id' => $saiId,
//                         'value' => $value,
//                         'date' => Carbon::createFromFormat('Y-m-d', $date),
//                         'created_at' => now(),
//                         'updated_at' => now()
//                     ]);
//                 } else {
//                     // Log or handle cases where no matching SAI ID was found
//                     Log::warning("No SAI ID found for key: $key");
//                 }
//             }
//         }
//     }
// }
