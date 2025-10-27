<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrador do sistema, acesso total.',
                'level' => 10,
                'active' => true,
            ],
            [
                'name' => 'host',
                'description' => 'Anfitrião de propriedades, pode listar e gerenciar reservas.',
                'level' => 5,
                'active' => true,
            ],
            [
                'name' => 'client',
                'description' => 'Cliente padrão, pode buscar e reservar propriedades.',
                'level' => 1,
                'active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
