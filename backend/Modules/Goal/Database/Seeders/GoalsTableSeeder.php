<?php
namespace Modules\Goal\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Goal\Entities\Goal;
use Illuminate\Support\Facades\Log;
use Modules\ServiceActivityIndicator\Entities\ServiceActivityIndicator;


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
        // Assuming $saiMap is available via Dependency Injection or other mechanism
        $saiMap = $this->loadSAIMap();

        $goalsData = [
            [
                'service' => 'Consulta Externa',
                'activity' => 'Psiquiatria Adultos',
                'indicators' => [
                    ['name' => 'Nº Consultas Total', 'target' => 42856],
                    ['name' => 'Primeiras Consultas', 'target' => 10451],
                    ['name' => 'Consultas Subsequentes', 'target' => 32405]
                ]
            ],
            [
                'service' => 'Consulta Externa',
                'activity' => 'Psiquiatria Infância e Adolescência',
                'indicators' => [
                    ['name' => 'Nº Consultas Total', 'target' => 8803],
                    ['name' => 'Primeiras Consultas', 'target' => 1556],
                    ['name' => 'Consultas Subsequentes', 'target' => 4559]
                ]
            ],
            [
                'service' => 'Consulta Externa',
                'activity' => 'Quadro Resumo',
                'indicators' => [
                    ['name' => 'Nº de 1ªs Consultas Médicas', 'target' => 12006],
                    ['name' => 'Nº de Consultas Médicas Subsequentes', 'target' => 36964]
                ]
            ],
            [
                'service' => 'Internamento Agudos',
                'activity' => null,
                'indicators' => [
                    ['name' => 'Lotação', 'target' => 406]
                ]
            ],
            [
                'service' => 'Internamento Crónicos',
                'activity' => null,
                'indicators' => [
                    ['name' => 'Dias de Internamento (Totais) Doentes Crónicos', 'target' => 13054],
                    ['name' => 'Demora média Crónicos(HPA)', 'target' => 23],
                    ['name' => 'Demora média Crónicos (Santa Casa Misericórdia Amarante)', 'target' => 10]
                ]
            ],
            [
                'service' => 'Hospital Dia',
                'activity' => null,
                'indicators' => [
                    ['name' => 'Nº Sessões Total', 'target' => 23],
                    ['name' => 'Nº Doentes', 'target' => 10]
                ]
            ],
            [
                'service' => 'Serviço Domiciliário',
                'activity' => null,
                'indicators' => [
                    ['name' => 'Total de Visitas Domiciliárias', 'target' => 7934]
                ]
            ],
            [
                'service' => 'Consulta Externa',
                'activity' => 'Psiquiatria Adultos',
                'indicators' => [
                    ['name' => 'Nº Consultas Total', 'target' => 48000],
                    ['name' => 'Primeiras Consultas', 'target' => 11500],
                    ['name' => 'Consultas Subsequentes', 'target' => 36500]
                ]
            ],
            [
                'service' => 'Consulta Externa',
                'activity' => 'Quadro Resumo',
                'indicators' => [
                    ['name' => 'Nº de 1ªs Consultas Médicas', 'target' => 12500],
                    ['name' => 'Nº de Consultas Médicas Subsequentes', 'target' => 37000]
                ]
            ],
            [
                'service' => 'Internamento Crónicos',
                'activity' => null,
                'indicators' => [
                    ['name' => 'Dias de Internamento (Totais) Doentes Crónicos', 'target' => 14000],
                    ['name' => 'Demora média Crónicos(HPA)', 'target' => 22],
                    ['name' => 'Demora média Crónicos (Santa Casa Misericórdia Amarante)', 'target' => 11]
                ]
            ],
            [
                'service' => 'Hospital Dia',
                'activity' => null,
                'indicators' => [
                    ['name' => 'Nº Sessões Total', 'target' => 25],
                    ['name' => 'Nº Doentes', 'target' => 10]
                ]
            ],
            [
                'service' => 'Serviço Domiciliário',
                'activity' => null,
                'indicators' => [
                    ['name' => 'Total de Visitas Domiciliárias', 'target' => 9000]
                ]
            ],

        ];

        foreach ($goalsData as $data) {
            foreach ($data['indicators'] as $indicatorData) {
                $key = $data['service'] . '|' . ($data['activity'] ?? '') . '|' . $indicatorData['name'];
                $saiId = $saiMap[$key] ?? null;

                if ($saiId) {
                    Goal::create([
                        'service_activity_indicator_id' => $saiId,
                        'target_value' => $indicatorData['target'],
                        'year' => 2024,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } else {
                    Log::warning("No SAI ID found for key: $key");
                }
            }
        }
    }

    private function loadSAIMap()
    {
        $sais = ServiceActivityIndicator::with(['service', 'activity', 'indicator'])->get();
        $map = [];

        foreach ($sais as $sai) {
            $key = $sai->service->service_name . '|' .
                ($sai->activity ? $sai->activity->activity_name . '|' : '') .
                $sai->indicator->indicator_name;
            $map[$key] = $sai->id;
        }

        return $map;
    }
}
