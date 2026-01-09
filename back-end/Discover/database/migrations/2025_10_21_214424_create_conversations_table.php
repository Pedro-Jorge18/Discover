<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Cliente
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade'); // Anfitrião
            $table->string('subject')->nullable(); // Assunto da conversa
            $table->timestamp('last_message_at')->nullable();
            $table->integer('unread_count_user')->default(0); // Mensagens não lidas pelo usuário
            $table->integer('unread_count_host')->default(0); // Mensagens não lidas pelo anfitrião
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['property_id', 'user_id']); // Uma conversa por propriedade
            $table->index(['user_id', 'last_message_at']);
            $table->index(['host_id', 'last_message_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
