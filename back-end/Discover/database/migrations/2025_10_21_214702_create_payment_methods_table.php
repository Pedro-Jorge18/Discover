<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // credit_card, debit_card, pix, paypal
            $table->string('provider'); // stripe, mercado_pago, etc
            $table->string('last_four', 4)->nullable(); // Últimos 4 dígitos do cartão
            $table->string('brand')->nullable(); // Visa, Mastercard, etc
            $table->boolean('is_default')->default(false);
            $table->boolean('active')->default(true);
            $table->json('metadata')->nullable(); // Dados adicionais
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
