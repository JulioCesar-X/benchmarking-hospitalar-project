<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Service;
use App\Activity;
use App\Indicator;
use App\ServiceActivityIndicators;
use App\Record;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class RecordsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Criando o mapa de IDs para ServiceActivityIndicators
        $saiMap = $this->createSaiMap();

        $this->insertRecordsForPsiquiatriaAdultos($saiMap);
        $this->insertRecordsForPsiquiatriaInfanciaAdolescencia($saiMap);
        $this->insertRecordsForQuadroResumo($saiMap);
        $this->insertRecordsForInternamentoAgudos($saiMap);
        $this->insertRecordsForInternamentoTrofaSaude($saiMap);
        $this->insertRecordsForInternamentoCronicos($saiMap);
        $this->insertRecordsForHospitalDia($saiMap);
        $this->insertRecordsForServicoDomiciliario($saiMap);

    }
    private function createSaiMap()
    {
        return DB::table('service_activity_indicators')
        ->join('services', 'services.id', '=', 'service_activity_indicators.service_id')
        ->join('activities', 'activities.id', '=', 'service_activity_indicators.activity_id', 'left outer')
        ->join('indicators', 'indicators.id', '=', 'service_activity_indicators.indicator_id')
        ->select(
            'service_activity_indicators.id',
            'services.service_name',
            'activities.activity_name',
            'indicators.indicator_name'
        )
            ->get()
            ->mapWithKeys(function ($item) {
                // Criar uma chave única combinando serviço, atividade e indicador
                $activityName = $item->activity_name ?? 'None';  // Lidar com atividades possivelmente nulas
                return [$item->service_name . '|' . $activityName . '|' . $item->indicator_name => $item->id];
            });
    }

    private function insertRecordsForPsiquiatriaAdultos($saiMap)
    {
        $serviceName = 'Consulta Externa';
        $activityName = 'Psiquiatria Adultos';

        $datesValues = [
            '2023-01-31' => [
                'Primeiras Consultas' => 500,
                'Consultas Subsequentes' => 5000,
                'Consultas Marcadas e não Realizadas' => 633,
                'Encargos Globais' => 0,
                'Encargos / Consultas' => 0,
                'Encargo Consulta / Doente' => 0
            ],
            '2023-02-28' => [
                'Primeiras Consultas' => 606,
                'Consultas Subsequentes' => 355,
                'Consultas Marcadas e não Realizadas' => 633,
                'Encargos Globais' => 0,
                'Encargos / Consultas' => 0,
                'Encargo Consulta / Doente' => 0
            ],
            '2024-01-31' => [
                'Primeiras Consultas' => 509,
                'Consultas Subsequentes' => 5000,
                'Consultas Marcadas e não Realizadas' => 600,
                'Encargos Globais' => 0,
                'Encargos / Consultas' => 0,
                'Encargo Consulta / Doente' => 0
            ],
            '2024-02-28' => [
                'Primeiras Consultas' => 500,
                'Consultas Subsequentes' => 162,
                'Consultas Marcadas e não Realizadas' => 600,
                'Encargos Globais' => 0,
                'Encargos / Consultas' => 0,
                'Encargo Consulta / Doente' => 0
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . $activityName . '|' . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Assume a default of null if the key does not exist

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
    }
    private function insertRecordsForPsiquiatriaInfanciaAdolescencia($saiMap)
    {
        $serviceName = 'Consulta Externa';
        $activityName = 'Psiquiatria Infância e Adolescência';

        $datesValues = [
            '2023-01-31' => [
                'Primeiras Consultas' => 275,
                'Consultas Subsequentes' => 500,
                'Consultas Marcadas e não Realizadas' => 286,
            ],
            '2023-02-28' => [
                'Primeiras Consultas' => 300,
                'Consultas Subsequentes' => 496,
                'Consultas Marcadas e não Realizadas' => 100,
            ],
            '2024-01-31' => [
                'Primeiras Consultas' => 244,
                'Consultas Subsequentes' => 500,
                'Consultas Marcadas e não Realizadas' => 286,
            ],
            '2024-02-28' => [
                'Primeiras Consultas' => 200,
                'Consultas Subsequentes' => 699,
                'Consultas Marcadas e não Realizadas' => 100,
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . $activityName . '|' . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Check if the key exists in the map and retrieve the ID

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    // Log or handle cases where no matching SAI ID was found
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }
    private function insertRecordsForQuadroResumo($saiMap)
    {
        $serviceName = 'Consulta Externa';
        $activityName = 'Quadro Resumo';

        $datesValues = [
            '2023-01-31' => [
                'Nº de 1ªs Consultas Médicas' => 681,
                'Nº de Consultas Médicas Subsequentes' => 6000,
            ],
            '2023-02-28' => [
                'Nº de 1ªs Consultas Médicas' => 1000,
                'Nº de Consultas Médicas Subsequentes' => 351,
            ],
            '2024-01-31' => [
                'Nº de 1ªs Consultas Médicas' => 453,
                'Nº de Consultas Médicas Subsequentes' => 6000,
            ],
            '2024-02-28' => [
                'Nº de 1ªs Consultas Médicas' => 1000,
                'Nº de Consultas Médicas Subsequentes' => 361,
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . $activityName . '|' . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    // Log or handle cases where no matching SAI ID was found
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }

    private function insertRecordsForInternamentoAgudos($saiMap)
    {
        $serviceName = 'Internamento Agudos';
        $activityName = null; // No specific activity for Internamento Agudos

        $datesValues = [
            '2023-01-31' => [
                'Lotação' => 21,
                'Demora Média' => 10,
                'Ocupacão' => 28,
                'Taxa de Reinternamento (30 dias)' => 1.5,
                'Índice Case-Mix' => 0,
                'Doentes Saídos (Altas)' => 66,
                'Doentes Saídos P/Cama' => 1.6,
                'Encargos (rubricas)' => 0,
                'Encargos / Doentes Saídos' => 0,
            ],
            '2023-02-28' => [
                'Lotação' => 20,
                'Demora Média' => 7.8,
                'Ocupacão' => 10,
                'Taxa de Reinternamento (30 dias)' => 6,
                'Índice Case-Mix' => 0,
                'Doentes Saídos (Altas)' => 0,
                'Doentes Saídos P/Cama' => 0,
                'Encargos (rubricas)' => 0,
                'Encargos / Doentes Saídos' => 0,
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    // Log or handle cases where no matching SAI ID was found
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }
    private function insertRecordsForInternamentoTrofaSaude($saiMap)
    {
        $serviceName = 'Internamento Trofa Saúde';
        $activityName = null; // No specific activity for Internamento Trofa Saúde

        $datesValues = [
            '2023-01-31' => [
                'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 2,
                'Total dias de internamentos' => 57,
                'Preço de referência para diária (1)' => 89.00,
                'Encargos / Doentes Saídos' => 9333.00,
            ],
            '2023-02-28' => [
                'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 2,
                'Total dias de internamentos' => 40,
                'Preço de referência para diária (1)' => 100,
                'Encargos / Doentes Saídos' => 9000.00,
            ],
            '2024-01-31' => [
                'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 22,
                'Total dias de internamentos' => 676,
                'Preço de referência para diária (1)' => 115.00,
                'Encargos / Doentes Saídos' => 0,
            ],
            '2024-02-28' => [
                'Doentes de Psiquiatria no Exterior (Trofa Saúde)' => 100,
                'Total dias de internamentos' => 2000,
                'Preço de referência para diária (1)' => 100.00,
                'Encargos / Doentes Saídos' => 0,
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    // Log or handle cases where no matching SAI ID was found
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }
    private function insertRecordsForInternamentoCronicos($saiMap)
    {
        $serviceName = 'Internamento Crónicos';
        $activityName = null; // No specific activity for Internamento Crónicos

        $datesValues = [
            '2023-01-31' => [
                'Dias de Internamento (Totais) Doentes Crónicos' => 500,
                'Demora média Crónicos(HPA)' => 38,
                'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 0,
                'Doentes de Psiquiatria Crónicos (HPA)' => 4,
                'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 10,
                'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
            ],
            '2023-02-28' => [
                'Dias de Internamento (Totais) Doentes Crónicos' => 533,
                'Demora média Crónicos(HPA)' => 100,
                'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 2,
                'Doentes de Psiquiatria Crónicos (HPA)' => 3,
                'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 13,
                'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
            ],
            '2024-01-31' => [
                'Dias de Internamento (Totais) Doentes Crónicos' => 1000,
                'Demora média Crónicos(HPA)' => 40,
                'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 2,
                'Doentes de Psiquiatria Crónicos (HPA)' => 4,
                'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 10,
                'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
            ],
            '2024-02-28' => [
                'Dias de Internamento (Totais) Doentes Crónicos' => 1203,
                'Demora média Crónicos(HPA)' => 35,
                'Demora média Crónicos (Santa Casa Misericórdia Amarante)' => 0,
                'Doentes de Psiquiatria Crónicos (HPA)' => 2,
                'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)' => 13,
                'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)' => 0
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    // Log or handle cases where no matching SAI ID was found
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }

    private function insertRecordsForHospitalDia($saiMap)
    {
        $serviceName = 'Hospital Dia';
        $activityName = null; // Null since Hospital Dia does not relate to a specific activity

        $datesValues = [
            '2023-01-31' => [
                'Nº Sessões Total' => 1700,
                'Nº Doentes' => 500,
                'Encargos Globais' => 0,
                'Encargos/Sessão' => 0
            ],
            '2023-02-28' => [
                'Nº Sessões Total' => 1000,
                'Nº Doentes' => 601,
                'Encargos Globais' => 0,
                'Encargos/Sessão' => 0
            ],
            '2024-01-31' => [
                'Nº Sessões Total' => 1500,
                'Nº Doentes' => 500,
                'Encargos Globais' => 0,
                'Encargos/Sessão' => 0
            ],
            '2024-02-28' => [
                'Nº Sessões Total' => 1000,
                'Nº Doentes' => 512,
                'Encargos Globais' => 0,
                'Encargos/Sessão' => 0
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    // Log or handle cases where no matching SAI ID was found
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }

    private function insertRecordsForServicoDomiciliario($saiMap)
    {
        $serviceName = 'Serviço Domiciliário';
        $activityName = null; // Null since Serviço Domiciliário does not relate to a specific activity

        $datesValues = [
            '2023-01-31' => [
                'Total de Visitas Domiciliárias' => 187,
                'Encargos Globais' => 0,
                'Encargos/Visita' => 0
            ],
            '2023-02-28' => [
                'Total de Visitas Domiciliárias' => 1000,
                'Encargos Globais' => 0,
                'Encargos/Visita' => 0
            ],
            '2024-01-31' => [
                'Total de Visitas Domiciliárias' => 171,
                'Encargos Globais' => 0,
                'Encargos/Visita' => 0
            ],
            '2024-02-28' => [
                'Total de Visitas Domiciliárias' => 1000,
                'Encargos Globais' => 0,
                'Encargos/Visita' => 0
            ],
        ];

        foreach ($datesValues as $date => $values) {
            foreach ($values as $indicatorName => $value) {
                $key = $serviceName . '|' . ($activityName ? $activityName . '|' : '') . $indicatorName;
                $saiId = $saiMap[$key] ?? null;  // Retrieve the SAI ID from the map

                if ($saiId) {
                    DB::table('records')->insert([
                        'service_activity_indicator_id' => $saiId,
                        'value' => $value,
                        'date' => Carbon::createFromFormat('Y-m-d', $date),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    // Log or handle cases where no matching SAI ID was found
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }


}
