<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50); // Pendente, Confirmada, Cancelada, etc
            $table->string('description')->nullable();
            $table->string('color', 7)->nullable(); // Cor em hex (#FF0000)
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_statuses');
    }
};
