<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\PropertyRepositoryInterface;
use App\Models\Property;
use illuminate\Database\Eloquent\Collection;

class EloquentPropertyRepository implements PropertyRepositoryInterface
{
   /*
    1º etapa -> implementação do que vai ser feito.
        onde salvar e o que buscar.
        Validacoes dos dodos coverte para array e no momento so cria e e procura

   2º etapa -> contract como tem que ser feito
    *
    *
    * */
    public function create(array $data): Property
    {
        //Salvar property no DB
        return Property::create($data);
    }

     public function findById(int $id): ?Property
    {
        //procurar a propiedade
        return Property::find($id);
    }

    public function getAll():Collection
    {
        return Property::all();
    }
}
