<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\PropertyRepositoryInterface;
use App\Models\Property;
use Illuminate\Database\Eloquent\Collection;

class PropertyRepository implements PropertyRepositoryInterface
{
   /*
    * 1º etapa -> implementação do que vai ser feito.
    *    onde salvar e o que buscar.
    *    "Validações dos dados converte para array e no momento só cria e procura"
    *
    * 2º etapa -> contract como tem que ser feito
    */

    public function create(array $data): Property
    {
        //Salvar property no DB
        return Property::create($data);
    }

     public function findById(int $id): ?Property
    {
        // "procurar a propriedade"
        return Property::find($id);
    }
    public function update(int $id, array $data): bool
    {
        $property = Property::find($id);

        if(!$property){
            return false;
        }
        return $property->update($data);
    }
    public function delete(int $id): bool
    {
        $property =Property::find($id);

        if(!$property){
            return false;

        }
        return $property->delete();
    }
    public function getAll():Collection
    {
        return Property::all();
    }

    public function getPaginated(int $perPage = 15)
    {
        return Property::paginate($perPage);
    }
}
