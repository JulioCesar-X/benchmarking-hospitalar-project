<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

class EnsureRouteCacheIsCurrent
{
    public function handle($request, Closure $next)
    {
        if (config('app.env') === 'production' && !Cache::has('route_cache_timestamp')) {
            Artisan::call('route:cache');
            Cache::put('route_cache_timestamp', now(), now()->addDay());
        }

        return $next($request);
    }
}