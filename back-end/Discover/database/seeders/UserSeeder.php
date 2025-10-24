<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Host User',
            'last_name' => 'Silva',
            'phone' => '+5511999999999',
            'birthday' => '1990-01-01',
            'email' => 'host@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'gender' => 'M',
            'language' => 'pt',
            'about' => 'Anfitrião experiente com várias propriedades',
            'verified' => true,
            'active' => true,
        ]);

        User::create([
            'name' => 'Client User',
            'last_name' => 'Santos',
            'phone' => '+5511888888888',
            'birthday' => '1985-05-15',
            'email' => 'client@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'gender' => 'F',
            'language' => 'pt',
            'about' => 'Viajante frequente em busca de experiências únicas',
            'verified' => true,
            'active' => true,
        ]);


        User::create([
            'name' => 'Admin User',
            'last_name' => 'Sistema',
            'phone' => '+5511777777777',
            'birthday' => '1980-10-20',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'gender' => 'O',
            'language' => 'en',
            'about' => 'Administrador do sistema Discover',
            'verified' => true,
            'active' => true,
        ]);
    }
}
