<?php

namespace Modules\Auth\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Modules\Auth\Entities\User;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'Modules\Auth\Entities\Model' => 'Modules\Auth\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {

        $this->registerPolicies();

        Gate::define('admin-action', function ($user) {
            return $user->hasRole('Admin');
        });

        Gate::define('coordinator-action', function ($user) {
            return $user->hasRole('Coordenador');
        });

        //$this->loadMigrationsFrom(module_path('Auth', 'Database/Migrations'));
        // $this->loadViewsFrom(base_path('Modules/Auth/Resources/views'), 'auth');

    }

    public function register()
    {

        $this->app->register(RouteServiceProvider::class);
    }
}
