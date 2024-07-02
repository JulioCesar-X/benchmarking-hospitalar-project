<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;


class CreateVwIndicatorAccumulatedView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
    CREATE OR REPLACE VIEW vw_goals_monthly AS
    SELECT
        g.sai_id,
        sai.service_id,
        sai.activity_id,
        i.id AS indicator_id,
        g.year,
        g.target_value AS meta_anual,
        MONTH(r.date) AS month,
        ROUND(g.target_value / 12.0, 2) AS monthly_target,
        i.indicator_name AS nome_do_indicador,
        (
            SELECT SUM(ROUND(g2.target_value / 12.0, 2) * MONTH(r2.date))
            FROM goals g2
            JOIN records r2 ON r2.sai_id = g2.sai_id
            WHERE g2.sai_id = g.sai_id AND
                r2.date <= r.date AND
                YEAR(r2.date) = g.year
        ) AS valor_acumulado_mensal
    FROM goals g
    JOIN sais sai ON g.sai_id = sai.id
    JOIN indicators i ON sai.indicator_id = i.id
    LEFT JOIN records r ON r.sai_id = g.sai_id AND YEAR(r.date) = g.year
    GROUP BY
        g.sai_id, sai.service_id, sai.activity_id, i.id, g.year, MONTH(r.date), i.indicator_name, g.target_value, r.date;
");

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("DROP VIEW IF EXISTS vw_indicator_accumulated");
    }
}
