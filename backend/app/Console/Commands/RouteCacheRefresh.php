<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class RouteCacheRefresh extends Command
{
    protected $signature = 'route:cache-refresh';
    protected $description = 'Refresh the route cache';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        Artisan::call('route:cache');
        $this->info('Route cache refreshed successfully.');
    }
}
