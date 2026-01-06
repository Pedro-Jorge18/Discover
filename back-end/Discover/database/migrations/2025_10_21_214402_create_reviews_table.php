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
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User who reviewed
            $table->foreignId('reservation_id')->nullable()->constrained()->onDelete('cascade');

            // Individual ratings (1-5)
            $table->integer('rating_cleanliness')->default(5);
            $table->integer('rating_communication')->default(5);
            $table->integer('rating_checkin')->default(5);
            $table->integer('rating_accuracy')->default(5);
            $table->integer('rating_location')->default(5);
            $table->integer('rating_value')->default(5);

            // Overall rating
            $table->integer('rating_overall')->default(5);

            // Content
            $table->text('comment');
            $table->text('host_reply')->nullable(); // Host reply

            // Status
            $table->boolean('published')->default(true);
            $table->boolean('recommend')->default(true);

            // Dates
            $table->timestamp('host_replied_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['property_id', 'published']);
            $table->index(['user_id', 'published']);
            $table->unique(['property_id', 'user_id']); // One user can only review a property once
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
