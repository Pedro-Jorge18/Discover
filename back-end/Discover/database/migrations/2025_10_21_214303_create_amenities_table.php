<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('amenity_category_id')->constrained()->onDelete('cascade');
            $table->string('name', 100); // Ex: Wi-Fi, Piscina, Ar-condicionado
            $table->string('description')->nullable();
            $table->string('icon')->nullable();
            $table->enum('value_type', ['boolean', 'numeric', 'text'])->default('boolean');
            $table->string('unit')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};
