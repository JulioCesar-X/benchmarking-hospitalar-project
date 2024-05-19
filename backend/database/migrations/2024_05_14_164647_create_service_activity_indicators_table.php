<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateServiceActivityIndicatorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_activity_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained();
            $table->foreignId('indicator_id')->constrained();
            $table->foreignId('activity_id')->nullable()->constrained();
            $table->string('type')->nullable();
            $table->timestamps();
            $table->check('type IN (\'produção\', \'financeiro\', \'desempenho\')');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('service_activity_indicators', function (Blueprint $table) {
            $table->dropColumn('type'); // Se necessário, remova a coluna 'type' ao reverter
        });

        Schema::dropIfExists('service_activity_indicators');
    }
}
