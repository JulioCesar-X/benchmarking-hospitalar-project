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
            $table->string('type'); // Adicione a coluna 'type' que receberá a restrição
            $table->timestamps();
        });

        // Adicionar a restrição de verificação
        $valoresPermitidos = ['produção', 'financeiro', 'desempenho'];
        $restricao = implode(',', array_map(function ($valor) {
            return "'" . addslashes($valor) . "'";
        }, $valoresPermitidos));

        DB::statement("ALTER TABLE service_activity_indicators ADD CONSTRAINT check_type CHECK (type IN ($restricao))");
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
