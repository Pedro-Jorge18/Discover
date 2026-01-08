<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\PropertyRepositoryInterface;
use App\Models\Property;
use Illuminate\Database\Eloquent\Collection;

class PropertyRepository implements PropertyRepositoryInterface
{
    public function create(array $data): Property
    {
        return Property::create($data);
    }

     public function findById(int $id): ?Property
    {
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
        $property = Property::find($id);

        if(!$property){
            return false;

        }
        return (bool) $property->forceDelete();
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
