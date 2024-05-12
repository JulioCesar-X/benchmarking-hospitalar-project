<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ClearAllCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleaner';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all application caches';

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
        // Limpar cache de configuração
        Artisan::call('config:clear');

        // Limpar cache de rota
        Artisan::call('route:clear');

        // Limpar cache de view
        Artisan::call('view:clear');

        // Limpar cache de configuração de cache
        Artisan::call('cache:clear');

        // Limpar cache de configuração de configuração de cache
        Artisan::call('config:cache');

        $this->info('All caches cleared successfully!');
    }
}
