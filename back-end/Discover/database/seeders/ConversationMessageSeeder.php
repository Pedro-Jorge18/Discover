<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConversationMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $conversations = Conversation::all();
        $client = User::where('email', 'client@example.com')->first();

        foreach ($conversations as $conversation) {
            // Mensagem do cliente
            ConversationMessage::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $client->id,
                'message' => 'Olá! Gostaria de saber mais sobre esta propriedade. Está disponível para as datas que preciso?',
                'is_read' => true,
                'read_at' => now(),
            ]);

            // Host message
            ConversationMessage::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $conversation->host_id,
                'message' => 'Olá! Sim, a propriedade está disponível. Posso ajudar com alguma informação específica?',
                'is_read' => false,
            ]);
        }
    }
}
