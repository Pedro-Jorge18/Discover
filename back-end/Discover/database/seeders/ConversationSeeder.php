<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = Property::take(2)->get();
        $client = User::where('email', 'client@example.com')->first();

        foreach ($properties as $property) {
            Conversation::create([
                'property_id' => $property->id,
                'user_id' => $client->id,
                'host_id' => $property->host_id,
                'subject' => 'Consulta sobre ' . $property->title,
                'last_message_at' => now(),
                'unread_count_user' => 0,
                'unread_count_host' => 1,
                'active' => true,
            ]);
        }
    }
}
