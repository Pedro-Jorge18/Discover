<?php

namespace App\Actions\Property;

use App\Repositories\Contracts\PropertyRepositoryInterface;

class UpdatePropertyAction
{
    public function __construct(
        private PropertyRepositoryInterface $propertyRepository
    ) {}

    public function execute(int $id, array $data): bool
    {
        return $this->propertyRepository->update($id, $data);
    }
}
