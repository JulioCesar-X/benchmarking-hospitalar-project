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
        DB::statement("
    CREATE OR REPLACE VIEW vw_variation_rate AS
    SELECT
        vf1.sai_id,
        vf1.service_id,
        vf1.activity_id,
        vf1.indicator_id,
        vf1.nome_do_indicador,
        vf1.year AS year1,
        vf2.year AS year2,
        vf1.month,
        ROUND(vf1.valor_acumulado_agregado, 2) AS total_accumulated_year1,
        ROUND(vf2.valor_acumulado_agregado, 2) AS total_accumulated_year2,
        ROUND(vf2.valor_acumulado_agregado - vf1.valor_acumulado_agregado) AS variation_rate_homologous_abs,
        CASE
            WHEN vf1.valor_acumulado_agregado = 0 THEN NULL
            ELSE ROUND(((vf2.valor_acumulado_agregado - vf1.valor_acumulado_agregado) / vf1.valor_acumulado_agregado) * 100, 2)
        END AS variation_rate_homologous,
        ROUND(gm1.valor_acumulado_mensal, 2) AS monthly_target_year1,
        ROUND(gm2.valor_acumulado_mensal, 2) AS monthly_target_year2,
        ROUND(vf2.valor_acumulado_agregado - gm2.valor_acumulado_mensal) AS variation_rate_contractual_abs,
        CASE
            WHEN gm2.valor_acumulado_mensal = 0 THEN NULL
            ELSE ROUND(((vf2.valor_acumulado_agregado - gm2.valor_acumulado_mensal) / gm2.valor_acumulado_mensal) * 100, 2)
        END AS variation_rate_contractual
    FROM
        vw_indicator_accumulated vf1
    JOIN
        vw_indicator_accumulated vf2 ON vf1.sai_id = vf2.sai_id
            AND vf1.month = vf2.month
            AND vf1.year = vf2.year - 1
    JOIN
        vw_goals_monthly gm1 ON vf1.sai_id = gm1.sai_id
            AND vf1.year = gm1.year
            AND vf1.month = gm1.month
    JOIN
        vw_goals_monthly gm2 ON vf2.sai_id = gm2.sai_id
            AND vf2.year = gm2.year
            AND vf2.month = gm2.month;
");
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
