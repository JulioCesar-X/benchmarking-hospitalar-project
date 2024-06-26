<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateVwVariationRateView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('
    CREATE OR REPLACE VIEW vw_variation_rate AS
    SELECT
        vf1.service_id,
        vf1.activity_id,
        vf1.Nome_do_Indicador,
        vf1.year AS year1,
        vf2.year AS year2,
        vf1.month,
        vf1.valor_acumulado_Agregado AS total_accumulated_year1,
        vf2.valor_acumulado_Agregado AS total_accumulated_year2,
        vf2.valor_acumulado_Agregado - vf1.valor_acumulado_Agregado AS variation_rate_homologous_abs,
        ((vf2.valor_acumulado_Agregado - vf1.valor_acumulado_Agregado) / NULLIF(vf1.valor_acumulado_Agregado, 0)) * 100 AS variation_rate_homologous,
        gm1.monthly_target AS monthly_target_year1,
        gm2.monthly_target AS monthly_target_year2,
        gm2.monthly_target - gm1.monthly_target AS variation_rate_contractual_abs,
        ((gm2.monthly_target - gm1.monthly_target) / NULLIF(gm1.monthly_target, 0)) * 100 AS variation_rate_contractual
    FROM
        vw_indicator_accumulated vf1
    JOIN
        vw_indicator_accumulated vf2 ON vf1.service_id = vf2.service_id
            AND vf1.activity_id = vf2.activity_id
            AND vf1.Nome_do_Indicador = vf2.Nome_do_Indicador
            AND vf1.month = vf2.month
    JOIN
        vw_goals_monthly gm1 ON vf1.service_id = gm1.service_id
            AND vf1.activity_id = gm1.activity_id
            AND vf1.Nome_do_Indicador = gm1.Nome_do_Indicador
            AND vf1.year = gm1.year
            AND vf1.month = gm1.month
    JOIN
        vw_goals_monthly gm2 ON vf2.service_id = gm2.service_id
            AND vf2.activity_id = gm2.activity_id
            AND vf2.Nome_do_Indicador = gm2.Nome_do_Indicador
            AND vf2.year = gm2.year
            AND vf2.month = gm2.month
');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("DROP VIEW IF EXISTS vw_variation_rate");
    }
}
