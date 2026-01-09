<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_category_pivot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_category_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['property_id', 'property_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_category_pivot');
    }
};
