<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            // RELACIONAMENTOS
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Cliente
            $table->foreignId('status_id')->constrained('reservation_statuses')->onDelete('cascade');

            // DATAS DA RESERVA
            $table->date('check_in');
            $table->date('check_out');
            $table->integer('nights'); // Number of nights calculated

            // GUESTS
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            $table->integer('infants')->default(0);
            $table->text('special_requests')->nullable(); // Pedidos especiais

            // PRICES AND VALUES
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('cleaning_fee', 10, 2)->default(0);
            $table->decimal('service_fee', 10, 2)->default(0);
            $table->decimal('security_deposit', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2); // (price_per_night * nights)
            $table->decimal('total_amount', 10, 2); // subtotal + taxas
            $table->decimal('amount_paid', 10, 2)->default(0); // Amount already paid

            //  PAYMENT INFORMATION
            $table->string('payment_method', 50)->nullable(); // card, pix, etc
            $table->string('transaction_id')->nullable(); // Transaction ID
            $table->timestamp('payment_date')->nullable();
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');

            // CODE AND STATUS
            $table->string('reservation_code')->unique(); // Unique reservation code
            $table->text('cancellation_reason')->nullable(); // Motivo do cancelamento
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();

            // METADADOS
            $table->text('host_notes')->nullable(); // Host notes
            $table->text('internal_notes')->nullable(); // Notas internas

            $table->timestamps();
            $table->softDeletes();

            // INDEXES
            $table->index(['property_id', 'check_in', 'check_out']);
            $table->index(['user_id', 'status_id']);
            $table->index('reservation_code');
            $table->index('payment_status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
