<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Support\Str;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::take(2)->get();

        foreach ($users as $index => $user) {
            // Cartão de crédito para o primeiro usuário
            PaymentMethod::create([
                'user_id' => $user->id,
                'type' => 'credit_card',
                'provider' => 'stripe',
                'last_four' => '4242',
                'brand' => 'Visa',
                'is_default' => $index === 0,
                'active' => true,
                'metadata' => json_encode([
                    'card_id' => 'card_' . Str::random(14),
                    'exp_month' => 12,
                    'exp_year' => 2026,
                ]),
            ]);

            // PIX para o mesmo usuário
            PaymentMethod::create([
                'user_id' => $user->id,
                'type' => 'pix',
                'provider' => 'mercadopago',
                'last_four' => null,
                'brand' => null,
                'is_default' => false,
                'active' => true,
                'metadata' => json_encode([
                    'pix_key' => $user->email,
                    'pix_type' => 'email',
                ]),
            ]);

            // PayPal para o segundo usuário
            if ($index === 1) {
                PaymentMethod::create([
                    'user_id' => $user->id,
                    'type' => 'paypal',
                    'provider' => 'paypal',
                    'last_four' => null,
                    'brand' => null,
                    'is_default' => true,
                    'active' => true,
                    'metadata' => json_encode([
                        'paypal_email' => $user->email,
                        'payer_id' => 'PAYER_' . Str::random(8),
                    ]),
                ]);
            }
        }
    }
}
