<?php

namespace App\Repositories\Contracts;

use App\Models\Property;


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

    // vai buscara propiedade pelo id, se nao esncotrar volta nulo
    public function findById(int $id): ?Property;

    public function getAll();
}
