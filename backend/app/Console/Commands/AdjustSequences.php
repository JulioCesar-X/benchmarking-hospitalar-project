<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AdjustSequences extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:adjust-sequences';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adjust PostgreSQL sequences for the IDs of all tables';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $tables = [
            'indicators' => 'indicators_id_seq',
            'users' => 'users_id_seq',
            'roles' => 'roles_id_seq',
            'services' => 'services_id_seq',
            'activities' => 'activities_id_seq',
            'sais' => 'sais_id_seq',
            'notifications' => 'notifications_id_seq',
            'records' => 'records_id_seq',
            'goals' => 'goals_id_seq',
            // Adicione aqui mais tabelas criadas ...
        ];

        foreach ($tables as $table => $sequence) {
            $maxId = DB::table($table)->max('id');
            $newVal = $maxId ? $maxId + 1 : 1;
            DB::statement("SELECT setval('$sequence', $newVal, false)");
            $this->info("Adjusted sequence for $table to $newVal");
        }

        $this->info('All sequences adjusted successfully.');

        return 0;
    }
}