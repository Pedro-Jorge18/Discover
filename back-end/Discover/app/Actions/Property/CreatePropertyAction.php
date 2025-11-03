<?php

namespace App\Actions\Property;

use App\Repositories\Contracts\PropertyRepositoryInterface;


/*
  3º etapa -> construcao das propiedades e busca pelo id's
      todos os imoveis criados tem que seguir esse processo.

    4º etapa -> DTO
 *
 * */
class CreatePropertyAction
{
    public function __construct(

        private PropertyRepositoryInterface $propertyRepository
    ){}

    public function execute(array $data)
    {
        $property = $this->propertyRepository->create($data);

        return $property;
    }
}
