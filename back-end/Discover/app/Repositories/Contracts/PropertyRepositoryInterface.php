<?php

namespace App\Repositories\Contracts;

use App\Models\Property;
use Illuminate\Database\Eloquent\Collection;

/*
  2º etapa -> o que tem que ser feito
     Vai buscar os Dados no DB.
 *   Repository Eloquent
  3º etapa -> Action
 *
 * */
interface PropertyRepositoryInterface
{

    public function create(array $data): Property;

    // "vai buscar a propriedade pelo id, se não encontrar volta nulo"
    public function findById(int $id): ?Property;

    public function getAll():Collection;

    public function getPaginated(int $perPage = 15);

}
