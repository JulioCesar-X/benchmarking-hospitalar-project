<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('services')->insert([
            ['service_name' => 'Consulta Externa', 'created_at' => now(), 'updated_at' => now()],
            ['service_name' => 'Internamento Agudos', 'created_at' => now(), 'updated_at' => now()],
            ['service_name' => 'Internamento Trofa Saúde', 'created_at' => now(), 'updated_at' => now()],
            ['service_name' => 'Internamento Crónicos', 'created_at' => now(), 'updated_at' => now()],
            ['service_name' => 'Serviço Domiciliário', 'created_at' => now(), 'updated_at' => now()],
            ['service_name' => 'Hospital Dia', 'created_at' => now(), 'updated_at' => now()]
        ]);
    }
}
