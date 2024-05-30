<?php

namespace Modules\User\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Factory;
use Illuminate\Support\Facades\Config;

class UserServiceProvider extends ServiceProvider
{
    protected $moduleName = 'User';
    protected $moduleNameLower = 'user';

    public function boot()
    {
        // $this->registerConfig();
        // $this->registerViews();
        // $this->registerTranslations();
        $this->loadMigrationsFrom(module_path('User', 'Database/Migrations'));
    }

    public function register()
    {
        $this->app->register(RouteServiceProvider::class);
    }

    // protected function registerConfig()
    // {
    //     $this->publishes([
    //         module_path($this->moduleName, 'Config/config.php') => config_path($this->moduleNameLower . '.php'),
    //     ], 'config');
    //     $this->mergeConfigFrom(
    //         module_path($this->moduleName, 'Config/config.php'),
    //         $this->moduleNameLower
    //     );
    // }

    // protected function registerViews()
    // {
    //     $viewPath = resource_path('views/modules/' . $this->moduleNameLower);

    //     $sourcePath = module_path($this->moduleName, 'Resources/views');

    //     $this->publishes([
    //         $sourcePath => $viewPath
    //     ], ['views', $this->moduleNameLower . '-module-views']);

    //     $this->loadViewsFrom(array_merge($this->getPublishableViewPaths(), [$sourcePath]), $this->moduleNameLower);
    // }

    // protected function registerTranslations()
    // {
    //     $langPath = resource_path('lang/modules/' . $this->moduleNameLower);

    //     if (is_dir($langPath)) {
    //         $this->loadTranslationsFrom($langPath, $this->moduleNameLower);
    //     } else {
    //         $this->loadTranslationsFrom(module_path($this->moduleName, 'Resources/lang'), $this->moduleNameLower);
    //     }
    // }

    // private function getPublishableViewPaths(): array
    // {
    //     $paths = [];
    //     foreach (Config::get('view.paths') as $path) {
    //         if (is_dir($path . '/modules/' . $this->moduleNameLower)) {
    //             $paths[] = $path . '/modules/' . $this->moduleNameLower;
    //         }
    //     }
    //     return $paths;
    // }
}
