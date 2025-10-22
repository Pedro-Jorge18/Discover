<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100); // Inteiro, Quarto Privado, Quarto Compartilhado
            $table->string('description')->nullable();
            $table->string('slug')->unique(); // entire-place, private-room, shared-room
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_types');
    }
};
