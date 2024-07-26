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
                'image_url' => 'assets/images/1.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/consultas/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Agudos',
                'description' => 'Unidade especializada no tratamento intensivo de pacientes com transtornos mentais agudos que necessitam de cuidados médicos e de enfermagem constantes em ambiente hospitalar. Este serviço é projetado para estabilizar pacientes em crise, oferecendo um ambiente seguro e controlado.',
                'image_url' => 'assets/images/3.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/internamento-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Trofa Saúde',
                'description' => 'Serviço de internamento em parceria com a Trofa Saúde, focado no tratamento de pacientes com transtornos mentais que requerem hospitalização em ambiente especializado. Este serviço oferece instalações modernas e equipadas com tecnologias avançadas para o tratamento de uma variedade de transtornos mentais.',
                'image_url' => 'assets/images/5.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/internamento-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Crónicos',
                'description' => 'Serviço destinado a pacientes com transtornos mentais crônicos que precisam de cuidados prolongados e acompanhamento contínuo para manutenção da estabilidade e qualidade de vida. Este serviço oferece um ambiente estruturado onde os pacientes recebem tratamento médico contínuo, suporte psicossocial, e participam de atividades terapêuticas que promovem a autonomia e a integração social.',
                'image_url' => 'assets/images/4.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/internamento-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Serviço Domiciliário',
                'description' => 'Serviço que oferece cuidados psiquiátricos e suporte terapêutico no domicílio dos pacientes, visando promover a estabilidade mental e reduzir a necessidade de hospitalizações. Este serviço é ideal para pacientes com dificuldades de mobilidade ou que preferem receber tratamento no conforto de suas casas. ',
                'image_url' => 'assets/images/2.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/cuidados-primarios/penafiel/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Hospital Dia',
                'description' => 'Serviço que proporciona tratamento intensivo durante o dia para pacientes que não necessitam de internamento noturno, incluindo terapias, atividades e suporte para reintegração social. O Hospital Dia oferece uma alternativa flexível ao internamento completo, permitindo que os pacientes participem de sessões terapêuticas e atividades estruturadas durante o dia e retornem para casa à noite.',
                'image_url' => 'assets/images/11.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/cuidados-primarios/penafiel/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Análise e Diagnóstico Avançado',
                'description' => 'Explore nossas instalações de ponta para análise e diagnóstico. Com tecnologia moderna e equipamentos avançados, oferecemos exames detalhados para garantir a precisão do diagnóstico e a eficácia do tratamento',
                'image_url' => 'assets/images/7.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/instituicao-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Cuidado Compassivo ao Paciente',
                'description' => 'Dedicados ao conforto e bem-estar de nossos pacientes, nossos serviços incluem atendimento personalizado e apoio contínuo para pacientes e suas famílias durante o tratamento.',
                'image_url' => 'assets/images/6.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/instituicao-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Consulta Especializada em Saúde',
                'description' => 'Nossos especialistas estão disponíveis para consultas detalhadas, utilizando as mais recentes tecnologias para oferecer diagnósticos precisos e planos de tratamento eficazes adaptados às necessidades individuais de cada paciente',
                'image_url' => 'assets/images/9.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/instituicao-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Formação e Educação Continuada',
                'description' => 'Oferecemos programas de formação para profissionais de saúde, promovendo a excelência através de educação continuada e treinamentos práticos para aprimorar habilidades e conhecimentos em diversas especialidades médicas',
                'image_url' => 'assets/images/8.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/instituicao-2/',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Recursos de Saúde Digital',
                'description' => 'Aproveite nossos recursos digitais de saúde, incluindo consultas virtuais e acesso a informações médicas online, facilitando o acompanhamento de tratamentos e a comunicação entre pacientes e profissionais de saúde',
                'image_url' => 'assets/images/10.jpg',
                'more_info' => 'https://www.chts.min-saude.pt/instituicao-2/',
                'created_at' => now(),
                'updated_at' => now()
            ]

        ];

        DB::table('services')->insert($services);
    }
}
