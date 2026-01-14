<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');

            // Content
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();

            // Tipo de mensagem
            $table->enum('type', ['inquiry', 'booking', 'general'])->default('general');

            $table->timestamps();

            // Indexes
            $table->index(['reservation_id', 'created_at']);
            $table->index(['sender_id', 'receiver_id']);
            $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
