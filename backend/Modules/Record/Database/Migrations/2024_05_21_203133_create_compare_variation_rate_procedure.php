<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateCompareVariationRateProcedure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            CREATE OR REPLACE FUNCTION compare_variation_rate(start_year INT, end_year INT)
            RETURNS TABLE(
                service_id INTEGER,
                activity_id INTEGER,
                Nome_do_Indicador TEXT,
                year_start INTEGER,
                year_end INTEGER,
                month INTEGER,
                total_accumulated_year_start NUMERIC,
                total_accumulated_year_end NUMERIC,
                variation_rate_homologous_abs NUMERIC,
                variation_rate_homologous NUMERIC,
                monthly_target_year_start NUMERIC,
                monthly_target_year_end NUMERIC,
                variation_rate_contractual_abs NUMERIC,
                variation_rate_contractual NUMERIC
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT
                    vf1.service_id::INTEGER,
                    vf1.activity_id::INTEGER,
                    vf1.Nome_do_Indicador,
                    vf1.year AS year_start,
                    vf2.year AS year_end,
                    vf1.month,
                    ROUND(vf1.valor_acumulado_Agregado::NUMERIC, 2) AS total_accumulated_year_start,
                    ROUND(vf2.valor_acumulado_Agregado::NUMERIC, 2) AS total_accumulated_year_end,
                    ROUND((vf2.valor_acumulado_Agregado - vf1.valor_acumulado_Agregado)::NUMERIC, 2) AS variation_rate_homologous_abs,
                    ROUND(CAST(((vf2.valor_acumulado_Agregado - vf1.valor_acumulado_Agregado) / NULLIF(vf1.valor_acumulado_Agregado, 0)) * 100 AS NUMERIC), 2) AS variation_rate_homologous,
                    ROUND(gm1.monthly_target::NUMERIC, 2) AS monthly_target_year_start,
                    ROUND(gm2.monthly_target::NUMERIC, 2) AS monthly_target_year_end,
                    ROUND((gm2.monthly_target - gm1.monthly_target)::NUMERIC, 2) AS variation_rate_contractual_abs,
                    ROUND(CAST(((gm2.monthly_target - gm1.monthly_target) / NULLIF(gm1.monthly_target, 0)) * 100 AS NUMERIC), 2) AS variation_rate_contractual
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
                WHERE
                    vf1.year = start_year
                    AND vf2.year = end_year
                    AND gm1.year = start_year
                    AND gm2.year = end_year;
            END;
            $$ LANGUAGE plpgsql;
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("DROP FUNCTION IF EXISTS compare_variation_rate(INT, INT)");
    }
}
