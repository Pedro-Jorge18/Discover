<?php

namespace App\Providers;


use App\Repositories\Contracts\PropertyRepositoryInterface;
use App\Repositories\Eloquent\PropertyRepository;
use Illuminate\Support\ServiceProvider;
use App\Services\Property\PropertyImageService;

class PropertyServiceProvider extends ServiceProvider
{

    /*
     *  7º etapa -> ServiceProvider - Conexão de tudo que foi feito.
     *
     * */
    public function register(): void
    {
        $this->app->bind(
            PropertyRepositoryInterface::class,
            PropertyRepository::class);

        $this->app->singleton(\App\Actions\Property\CreatePropertyAction::class);
        $this->app->singleton(\App\Actions\Property\FindPropertyAction::class);
        $this->app->singleton(\App\Actions\Property\UpdatePropertyAction::class);
        $this->app->singleton(\App\Actions\Property\DeletePropertyAction::class);

        $this->app->bind(\App\Services\Property\PropertyService::class);
        $this->app->bind(PropertyImageService::class);

    }

    public function boot(): void
    {}

}
