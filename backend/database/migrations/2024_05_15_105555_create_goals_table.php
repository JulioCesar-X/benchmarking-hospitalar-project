<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateGoalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //alteração commit apagar
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_activity_indicator_id')->constrained();
            $table->float('target_value')->nullable(false);
            $table->date('year')->default(DB::raw('YEAR(CURRENT_DATE)')); // Define o ano atual como valor padrão
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('goals');
    }
}
