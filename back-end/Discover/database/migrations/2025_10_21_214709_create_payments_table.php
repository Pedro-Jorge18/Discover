<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('payment_method_id')->nullable()->constrained()->onDelete('set null');

            // Payment information
            $table->string('payment_gateway'); // stripe, mercado_pago, etc
            $table->string('gateway_payment_id')->nullable(); // ID no gateway
            $table->string('gateway_intent_id')->nullable(); // ID do intent (Stripe)

            // Valores
            $table->decimal('amount', 10, 2);
            $table->decimal('gateway_fee', 10, 2)->default(0); // Taxa do gateway
            $table->string('currency', 3)->default('BRL');

            // Status
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'])->default('pending');
            $table->string('failure_reason')->nullable(); // Motivo da falha

            // Datas
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();

            // Metadados
            $table->json('metadata')->nullable(); // Dados adicionais do gateway
            $table->text('description')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['reservation_id', 'status']);
            $table->index(['user_id', 'created_at']);
            $table->index('gateway_payment_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
