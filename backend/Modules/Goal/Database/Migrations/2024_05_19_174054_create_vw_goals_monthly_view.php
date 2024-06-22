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
    g.service_activity_indicator_id,
    sai.service_id as service_id,
    sai.activity_id as activity_id,
    i.id as indicator_id,
    g.year as year,
    g.target_value as meta_anual,
    EXTRACT(MONTH FROM r.date) AS month,
    ROUND((g.target_value::numeric / 12.0) * EXTRACT(MONTH FROM r.date)::numeric, 2) AS monthly_target,
    i.indicator_name as nome_do_indicador
FROM
    goals g
JOIN
    service_activity_indicators sai ON g.service_activity_indicator_id = sai.id
JOIN
    indicators i ON sai.indicator_id = i.id
LEFT JOIN
    records r ON r.service_activity_indicator_id = g.service_activity_indicator_id AND EXTRACT(YEAR FROM r.date) = g.year
GROUP BY
    g.service_activity_indicator_id, sai.service_id, sai.activity_id, i.id, g.year, EXTRACT(MONTH FROM r.date), i.indicator_name, g.target_value, r.value, r.date;
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
