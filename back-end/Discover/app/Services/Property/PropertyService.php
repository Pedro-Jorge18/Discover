<?php

namespace App\Services\Property;

use App\Models\Property;
use App\DTOs\Property\PropertyData;
use App\Repositories\Contracts\PropertyRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;


class PropertyService
{

    /*
     *  5º etapa -> Services toda a lógica de negocio, podemos tratar os erros aqui.
     *
     *  6º etapa -> resources
     * */
    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function create(array $data)
    {
        try {
            // dado para o DTO
            $propertyData = PropertyData::fromArray($data);

             // Action executa e cria
            return $this->propertyRepository->create($propertyData->toArray());
        } catch (\Throwable $exception){
            Log::error('Error creating property: '.$exception->getMessage(),[
                'data'=>$data,
                'exception'=>$exception->getTraceAsString(),
            ]);

            throw $exception;
        }
    }
    public function find(int $id): ?Property
    {
        try {
            return $this->propertyRepository->findById($id);
        } catch (\Throwable $exception){
            Log::error('Error finding property: '.$exception->getMessage(),[
                'data'=>$id,
                'exception'=>$exception->getTraceAsString(),
            ]);
            throw $exception;
        }
    }
    public function listAll() : Collection
    {
        try {
            return $this->propertyRepository->getAll();
        } catch (\Throwable $exception) {
            Log::error('Error listing properties: '.$exception->getMessage());
            throw $exception;
        }
    }
    // Listagem de paginação
    public function listPaginated(int $perPage = 15) : LengthAwarePaginator
    {
        try {
            return $this->propertyRepository->getPaginated($perPage);
        } catch (\Throwable $exception) {
            Log::error('Error listing properties: '.$exception->getMessage(), [
                'perPage='.$perPage,
                'exception' => $exception->getTraceAsString(),
            ]);
            throw $exception;
        }
    }

    public function update(int $id, array $data): bool
    {
        try {

            //preço não poder ser menor que 1
            if (isset($date['price_per_night']) && $date['price_per_night'] <  1 ){
                throw new \Exception('Price per night must be greater than 1');
            }

            // validação de quantidade de hóspides
            if (isset($date['max_guests']) && $date['max_guests'] <  1 ){
                throw new \Exception('Maximum number of guests must be greater than 1');
            }

            // quantidade de camas
            if (isset($date['beds']) && $date['beds'] <  1 ){
                throw new \Exception('Beds must be greater than 1');
            }

            return $this->propertyRepository->update($id, $data);

        } catch (\Throwable $exception) {
            Log::error('Error updating property: '.$exception->getMessage(),[
                'property_id' => $id,
                'data' => $data,
                'exception' => $exception->getTraceAsString(),
            ]);
            throw $exception;
        }
    }

    public function delete(int $id): bool
    {
        try {
            return $this->propertyRepository->delete($id);

        } catch (\Throwable $exception) {
            Log::error('Error deleting property: '.$exception->getMessage(),[
                'property_id'=>$id,
                'exception'=>$exception->getTraceAsString(),
            ]);
            throw $exception;
        }

    }

}
