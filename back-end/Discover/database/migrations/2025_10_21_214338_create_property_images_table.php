<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('image_path'); // Caminho da imagem
            $table->string('image_name')->nullable(); // Nome original do arquivo
            $table->integer('order')->default(0); // Display order
            $table->boolean('is_primary')->default(false); // Imagem principal
            $table->string('caption')->nullable(); // Legenda da imagem
            $table->string('alt_text')->nullable(); // Texto alternativo
            $table->integer('file_size')->nullable(); // Tamanho do arquivo em bytes
            $table->string('file_type', 50)->nullable(); // image/jpeg, image/png
            $table->timestamps();

            $table->index(['property_id', 'is_primary']);
            $table->index(['property_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_images');
    }
};
