<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $services = [
            [
                'service_name' => 'Consulta Externa',
                'description' => 'Serviço que oferece consultas psiquiátricas a pacientes não internados, proporcionando diagnósticos, tratamentos e acompanhamento continuado para transtornos mentais. O objetivo deste serviço é permitir que os pacientes recebam cuidados especializados sem a necessidade de hospitalização. ',
                'image_url' => 'assets/images/consultas.PNG',
                'more_info' => 'https://www.chts.min-saude.pt/consultas/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Agudos',
                'description' => 'Unidade especializada no tratamento intensivo de pacientes com transtornos mentais agudos que necessitam de cuidados médicos e de enfermagem constantes em ambiente hospitalar. Este serviço é projetado para estabilizar pacientes em crise, oferecendo um ambiente seguro e controlado.',
                'image_url' => 'assets/images/internamento1.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/internamento-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Trofa Saúde',
                'description' => 'Serviço de internamento em parceria com a Trofa Saúde, focado no tratamento de pacientes com transtornos mentais que requerem hospitalização em ambiente especializado. Este serviço oferece instalações modernas e equipadas com tecnologias avançadas para o tratamento de uma variedade de transtornos mentais.',
                'image_url' => 'assets/images/internamento1.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/internamento-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Crónicos',
                'description' => 'Serviço destinado a pacientes com transtornos mentais crônicos que precisam de cuidados prolongados e acompanhamento contínuo para manutenção da estabilidade e qualidade de vida. Este serviço oferece um ambiente estruturado onde os pacientes recebem tratamento médico contínuo, suporte psicossocial, e participam de atividades terapêuticas que promovem a autonomia e a integração social.',
                'image_url' => 'assets/images/internamento1.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/internamento-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Serviço Domiciliário',
                'description' => 'Serviço que oferece cuidados psiquiátricos e suporte terapêutico no domicílio dos pacientes, visando promover a estabilidade mental e reduzir a necessidade de hospitalizações. Este serviço é ideal para pacientes com dificuldades de mobilidade ou que preferem receber tratamento no conforto de suas casas. ',
                'image_url' => 'assets/images/Domiciliario.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/cuidados-primarios/penafiel/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Hospital Dia',
                'description' => 'Serviço que proporciona tratamento intensivo durante o dia para pacientes que não necessitam de internamento noturno, incluindo terapias, atividades e suporte para reintegração social. O Hospital Dia oferece uma alternativa flexível ao internamento completo, permitindo que os pacientes participem de sessões terapêuticas e atividades estruturadas durante o dia e retornem para casa à noite.',
                'image_url' => 'assets/images/Hospital de dia.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/cuidados-primarios/penafiel/',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        
        for ($i = 6; $i <= 11; $i++) {
            $services[] = [
                'service_name' => 'service' . $i,
                'description' => 'Descrição padrão para serviços adicionais',
                'image_url' => 'assets/images/default.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/',
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        DB::table('services')->insert($services);
    }
}
