<?php

namespace App\Repositories\Contracts;

use App\Models\Property;
use Illuminate\Database\Eloquent\Collection;

/*
 * 2º etapa -> o que tem que ser feito
 *    Vai buscar os Dados no DB.
 *   Repository Eloquent
 * 3º etapa -> Action
 *
 * */
interface PropertyRepositoryInterface
{

    public function create(array $data): Property;

    // "fetch the property by id, if not found return null"
    public function findById(int $id): ?Property;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getAll():Collection;

    public function getPaginated(int $perPage = 15);

}
