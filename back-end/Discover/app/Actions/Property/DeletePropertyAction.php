<?php

namespace App\Actions\Property;

use App\Repositories\Contracts\PropertyRepositoryInterface;

class DeletePropertyAction
{
    public function __construct(
        private PropertyRepositoryInterface $propertyRepository
    ) {}

    public function execute(int $id): bool
    {
        return $this->propertyRepository->delete($id);
    }
}
