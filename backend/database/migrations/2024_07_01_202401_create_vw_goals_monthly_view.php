<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;


class CreateVwGoalsMonthlyView extends Migration
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
    m.month,
    ROUND(g.target_value / 12.0, 2) AS monthly_target,
    i.indicator_name AS nome_do_indicador,
    SUM(ROUND(g.target_value / 12.0, 2)) OVER (PARTITION BY g.sai_id, g.year ORDER BY m.month) AS valor_acumulado_mensal
FROM
    goals g
JOIN
    sais sai ON g.sai_id = sai.id
JOIN
    indicators i ON sai.indicator_id = i.id
JOIN
    (SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
     UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
     UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) AS m
ON
    m.month IS NOT NULL
GROUP BY
    g.sai_id, sai.service_id, sai.activity_id, i.id, g.year, m.month, i.indicator_name, g.target_value;
");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("DROP VIEW IF EXISTS vw_goals_monthly");
    }
}
