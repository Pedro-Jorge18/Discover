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
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade'); // Host
            $table->foreignId('property_type_id')->constrained()->onDelete('cascade'); // Casa, Apt, Quarto
            $table->foreignId('listing_type_id')->constrained()->onDelete('cascade'); // Inteiro, Privado, Compartilhado
            $table->foreignId('city_id')->constrained()->onDelete('cascade'); // Location

            // DETAILED LOCATION
            $table->string('address'); // Full address
            $table->string('neighborhood')->nullable(); // Bairro
            $table->string('postal_code', 20)->nullable(); // CEP
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            //BASIC INFORMATION
            $table->string('title');
            $table->text('description');
            $table->string('summary', 500)->nullable(); // Resumo curto

            // PRICES
            $table->decimal('price_per_night', 10, 2); // Price per night
            $table->decimal('cleaning_fee', 10, 2)->default(0); // Taxa de limpeza
            $table->decimal('service_fee', 10, 2)->default(0); // Service fee
            $table->decimal('security_deposit', 10, 2)->default(0); // Security deposit

            // CAPACIDADE
            $table->integer('max_guests')->default(1); // Maximum guests
            $table->integer('bedrooms')->default(1); // Quartos
            $table->integer('beds')->default(1); // Camas
            $table->integer('bathrooms')->default(1); // Banheiros

            // SPACE
            $table->integer('area')->nullable(); // Property area
            $table->integer('floor')->nullable(); // Andar (para apartamentos)

            // CONFIGURATION
            $table->time('check_in_time')->default('15:00'); // Check-in time
            $table->time('check_out_time')->default('11:00'); // Check-out time
            $table->integer('min_nights')->default(1); // Minimum nights
            $table->integer('max_nights')->default(30); // Maximum nights

            //  STATUS E VISIBILIDADE
            $table->boolean('published')->default(false); // If published
            $table->boolean('active')->default(true); // If active
            $table->boolean('instant_book')->default(false); // Instant booking
            $table->integer('views')->default(0); // Views counter

            // METRICS
            $table->decimal('rating', 3, 2)->default(0); // Average rating
            $table->integer('reviews_count')->default(0); // Total reviews

            // DATAS
            $table->timestamp('published_at')->nullable(); // Publication date
            $table->timestamps();
            $table->softDeletes();

            // INDEXES
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
