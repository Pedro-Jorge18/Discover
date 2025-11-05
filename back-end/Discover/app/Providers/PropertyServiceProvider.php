<?php

namespace App\Providers;


use App\Repositories\Contracts\PropertyRepositoryInterface;
use App\Repositories\Eloquent\PropertyRepository;
use Illuminate\Support\ServiceProvider;

class PropertyServiceProvider extends ServiceProvider
{

    /*
     *  7º etapa -> ServiceProvider - Conecção de tudo que foi feito.
     *
     * */
    public function register(): void
    {
        $this->app->bind(
            PropertyRepositoryInterface::class,
            PropertyRepository::class);

        $this->app->singleton(\App\Actions\Property\CreatePropertyAction::class);
        $this->app->singleton(\App\Actions\Property\FindPropertyAction::class);

        $this->app->bind(\App\Services\Property\PropertyService::class);

    }

    public function boot(): void
    {}

}
