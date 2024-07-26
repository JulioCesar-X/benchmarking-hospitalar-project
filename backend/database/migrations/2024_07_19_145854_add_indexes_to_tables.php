<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexesToTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->index('service_name'); // Índice para service_name
        });

        Schema::table('indicators', function (Blueprint $table) {
            $table->index('indicator_name'); // Índice para indicator_name
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->index('activity_name'); // Índice para activity_name
        });

        Schema::table('sais', function (Blueprint $table) {
            $table->index('activity_id');  // Índice para activity_id
            $table->index('indicator_id'); // Índice para indicator_id
            $table->index('service_id');   // Índice para service_id
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['service_name']); // Remove o índice de service_name
        });

        Schema::table('indicators', function (Blueprint $table) {
            $table->dropIndex(['indicator_name']); // Remove o índice de indicator_name
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->dropIndex(['activity_name']); // Remove o índice de activity_name
        });

        Schema::table('sais', function (Blueprint $table) {
            $table->dropIndex(['activity_id']);  // Remove o índice de activity_id
            $table->dropIndex(['indicator_id']); // Remove o índice de indicator_id
            $table->dropIndex(['service_id']);   // Remove o índice de service_id
        });
    }
}