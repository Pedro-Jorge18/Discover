<?php

namespace App\Actions\Property;

use App\Repositories\Contracts\PropertyRepositoryInterface;

/*
 *  5ª passo -> Executa os casos nesse ponto cria uma property, nesse caso faz procura peo id.
 *
 * */
class FindPropertyAction
{

    public function __construct(
       private PropertyRepositoryInterface $propertyRepository)
    {}

    public function execute(int $id)
    {
        return $this->propertyRepository->findById($id);
    }
}
