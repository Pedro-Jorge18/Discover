<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();

            // RELACIONAMENTOS
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade'); // Anfitrião
            $table->foreignId('property_type_id')->constrained()->onDelete('cascade'); // Casa, Apt, Quarto
            $table->foreignId('listing_type_id')->constrained()->onDelete('cascade'); // Inteiro, Privado, Compartilhado
            $table->foreignId('city_id')->constrained()->onDelete('cascade'); // Localização

            // LOCALIZAÇÃO DETALHADA
            $table->string('address'); // Endereço completo
            $table->string('neighborhood')->nullable(); // Bairro
            $table->string('postal_code', 20)->nullable(); // CEP
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            //INFORMAÇÕES BÁSICAS
            $table->string('title');
            $table->text('description');
            $table->string('summary', 500)->nullable(); // Resumo curto

            // PREÇOS
            $table->decimal('price_per_night', 10, 2); // Preço por noite
            $table->decimal('cleaning_fee', 10, 2)->default(0); // Taxa de limpeza
            $table->decimal('service_fee', 10, 2)->default(0); // Taxa de serviço
            $table->decimal('security_deposit', 10, 2)->default(0); // Depósito de segurança

            // CAPACIDADE
            $table->integer('max_guests')->default(1); // Máximo de hóspedes
            $table->integer('bedrooms')->default(1); // Quartos
            $table->integer('beds')->default(1); // Camas
            $table->integer('bathrooms')->default(1); // Banheiros

            // ESPAÇO
            $table->integer('area')->nullable(); // Área do imovel
            $table->integer('floor')->nullable(); // Andar (para apartamentos)

            // CONFIGURAÇÕES
            $table->time('check_in_time')->default('15:00'); // Horário check-in
            $table->time('check_out_time')->default('11:00'); // Horário check-out
            $table->integer('min_nights')->default(1); // Mínimo de noites
            $table->integer('max_nights')->default(30); // Máximo de noites

            //  STATUS E VISIBILIDADE
            $table->boolean('published')->default(false); // Se está publicado
            $table->boolean('active')->default(true); // Se está ativo
            $table->boolean('instant_book')->default(false); // Reserva instantânea
            $table->integer('views')->default(0); // Contador de visualizações

            // MÉTRICAS
            $table->decimal('rating', 3, 2)->default(0); // avaliação média
            $table->integer('reviews_count')->default(0); // Total de avaliações

            // DATAS
            $table->timestamp('published_at')->nullable(); // Data de publicação
            $table->timestamps();
            $table->softDeletes();

            // ÍNDICES
            $table->index(['host_id', 'active']);
            $table->index(['city_id', 'published', 'active']);
            $table->index(['property_type_id', 'listing_type_id']);
            $table->index('price_per_night');
            $table->index('published_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
