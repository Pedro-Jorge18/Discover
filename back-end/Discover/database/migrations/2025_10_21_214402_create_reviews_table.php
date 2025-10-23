<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Usuário que avaliou
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');

            // Notas individuais (1-5)
            $table->integer('rating_cleanliness')->default(5);
            $table->integer('rating_communication')->default(5);
            $table->integer('rating_checkin')->default(5);
            $table->integer('rating_accuracy')->default(5);
            $table->integer('rating_location')->default(5);
            $table->integer('rating_value')->default(5);

            // Nota geral
            $table->integer('rating_overall')->default(5);

            // Conteúdo
            $table->text('comment');
            $table->text('host_reply')->nullable(); // Resposta do anfitrião

            // Status
            $table->boolean('published')->default(true);
            $table->boolean('recommend')->default(true);

            // Datas
            $table->timestamp('host_replied_at')->nullable();
            $table->timestamps();

            // Índices
            $table->index(['property_id', 'published']);
            $table->index(['user_id', 'published']);
            $table->unique(['reservation_id']); // Uma avaliação por reserva
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
