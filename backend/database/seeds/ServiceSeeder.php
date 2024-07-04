<?php

namespace Modules\Service\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Faker\Factory as Faker;

class ServicesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Inicializar o Faker
        $faker = Faker::create();

        // Inserir registros iniciais com `id`s fixos
        DB::table('services')->insert([
            [
                'service_name' => 'Consulta Externa',
                'description' => 'Serviço que oferece consultas psiquiátricas a pacientes não internados, proporcionando diagnósticos, tratamentos e acompanhamento continuado para transtornos mentais. O objetivo deste serviço é permitir que os pacientes recebam cuidados especializados sem a necessidade de hospitalização. As consultas externas incluem uma avaliação inicial detalhada, onde o histórico médico e psicológico do paciente é revisado e o diagnóstico é estabelecido. A partir daí, um plano de tratamento personalizado é desenvolvido, que pode incluir a prescrição de medicações psicotrópicas, terapia cognitivo-comportamental, psicoterapia de suporte e outras intervenções terapêuticas. O acompanhamento contínuo é uma parte crucial deste serviço, permitindo ajustes no tratamento conforme necessário e garantindo que os pacientes recebam suporte contínuo. Este serviço também pode envolver a coordenação com outros profissionais de saúde, como médicos de clínica geral, assistentes sociais e terapeutas ocupacionais, para proporcionar um cuidado holístico e integrado.',
                'imageUrl' => 'assets/images/consultas.PNG',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Agudos',
                'description' => 'Unidade especializada no tratamento intensivo de pacientes com transtornos mentais agudos que necessitam de cuidados médicos e de enfermagem constantes em ambiente hospitalar. Este serviço é projetado para estabilizar pacientes em crise, oferecendo um ambiente seguro e controlado. Os pacientes internados na unidade de agudos frequentemente apresentam sintomas severos que podem incluir psicose, mania, depressão grave ou comportamentos suicidas. O tratamento inclui a administração de medicamentos antipsicóticos, estabilizadores de humor, antidepressivos e outras medicações conforme necessário, além de terapia individual e em grupo. As atividades terapêuticas podem incluir terapia ocupacional, arte-terapia, e programas de exercício físico, todos projetados para ajudar os pacientes a recuperar a estabilidade mental e emocional. A equipe multidisciplinar trabalha em estreita colaboração para criar um plano de tratamento individualizado e também para planejar a alta do paciente, garantindo que haja um plano de cuidados contínuos e suporte após a saída do hospital.',
                'imageUrl' => 'assets/images/internamento1.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Trofa Saúde',
                'description' => 'Serviço de internamento em parceria com a Trofa Saúde, focado no tratamento de pacientes com transtornos mentais que requerem hospitalização em ambiente especializado. Este serviço oferece instalações modernas e equipadas com tecnologias avançadas para o tratamento de uma variedade de transtornos mentais. Os pacientes recebem cuidados de uma equipe multidisciplinar composta por psiquiatras, psicólogos, enfermeiros, terapeutas ocupacionais, assistentes sociais e outros profissionais de saúde mental. O internamento inclui um programa de reabilitação abrangente que pode envolver terapia ocupacional, terapia de grupo, psicoterapia individual, atividades recreativas e programas educacionais. A colaboração com a Trofa Saúde permite acesso a recursos adicionais e especialistas que podem contribuir para um plano de tratamento mais eficaz e abrangente. O objetivo deste serviço é não apenas tratar os sintomas agudos, mas também fornecer habilidades e suporte para que os pacientes possam reintegrar-se à sociedade de maneira produtiva e satisfatória.',
                'imageUrl' => 'assets/images/internamento1.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Internamento Crónicos',
                'description' => 'Serviço destinado a pacientes com transtornos mentais crônicos que precisam de cuidados prolongados e acompanhamento contínuo para manutenção da estabilidade e qualidade de vida. Este serviço oferece um ambiente estruturado onde os pacientes recebem tratamento médico contínuo, suporte psicossocial, e participam de atividades terapêuticas que promovem a autonomia e a integração social. O foco está em proporcionar uma qualidade de vida melhorada e em prevenir recaídas através de um cuidado holístico que inclui terapia ocupacional, atividades recreativas, e suporte emocional contínuo. O serviço visa manter a estabilidade mental dos pacientes, ajudando-os a gerenciar sintomas persistentes através de tratamentos contínuos, que podem incluir medicação, psicoterapia, e programas de apoio comunitário. Além disso, o internamento crônicos trabalha para envolver as famílias e os cuidadores, fornecendo-lhes educação e recursos para apoiar melhor os pacientes em seus ambientes diários.',
                'imageUrl' => 'assets/images/internamento1.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Serviço Domiciliário',
                'description' => 'Serviço que oferece cuidados psiquiátricos e suporte terapêutico no domicílio dos pacientes, visando promover a estabilidade mental e reduzir a necessidade de hospitalizações. Este serviço é ideal para pacientes com dificuldades de mobilidade ou que preferem receber tratamento no conforto de suas casas. Profissionais de saúde mental visitam regularmente os pacientes para fornecer medicação, terapia, e monitoramento da condição. As visitas domiciliares podem incluir sessões de terapia individual, administração e monitoramento de medicações, e suporte emocional. Além disso, o serviço domiciliar trabalha com os familiares para educá-los sobre como melhor apoiar o paciente e garantir um ambiente de apoio em casa. A integração dos cuidados domiciliares com outros serviços de saúde pode incluir coordenação com médicos de clínica geral e outros especialistas para garantir um tratamento abrangente. O objetivo é proporcionar um ambiente de cuidado contínuo e personalizado, que atenda às necessidades específicas de cada paciente e promova uma melhor qualidade de vida.',
                'imageUrl' => 'assets/images/Domiciliario.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'service_name' => 'Hospital Dia',
                'description' => 'Serviço que proporciona tratamento intensivo durante o dia para pacientes que não necessitam de internamento noturno, incluindo terapias, atividades e suporte para reintegração social. O Hospital Dia oferece uma alternativa flexível ao internamento completo, permitindo que os pacientes participem de sessões terapêuticas e atividades estruturadas durante o dia e retornem para casa à noite. Este serviço é particularmente útil para pacientes em fase de recuperação que ainda precisam de suporte intensivo, mas estão prontos para começar a reintegração na vida cotidiana. O tratamento inclui terapia individual, terapia de grupo, atividades recreativas, e programas de habilidades de vida diária. Os pacientes podem participar de oficinas de habilidades sociais, programas de reabilitação vocacional, e atividades de lazer que ajudam a melhorar suas capacidades funcionais e sociais. O objetivo do Hospital Dia é proporcionar um ambiente de tratamento estruturado que promove a independência e prepara os pacientes para uma vida produtiva e integrada na comunidade.',
                'imageUrl' => 'assets/images/Hospital de dia.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        // Adicionar 100 novos registros fictícios com `id`s calculados dinamicamente
        for ($i = 1; $i <= 100; $i++) {
            DB::table('services')->insert([
                'service_name' => 'Nome do Serviço ' . $i,
                'description' => $faker->paragraph,
                'imageUrl' => 'assets/images/Hospital de dia.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}


