<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\DemoConversation;
use App\Models\DemoMessage;
use App\Models\Project;
use App\Models\Technology;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PortfolioSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_migrations_create_portfolio_tables(): void
    {
        $tables = [
            'projects',
            'technologies',
            'project_technology',
            'project_images',
            'certifications',
            'contact_messages',
            'demo_shipments',
            'demo_notifications',
            'demo_conversations',
            'demo_messages',
        ];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Falta la tabla {$table}.");
        }
    }

    public function test_project_relates_to_technologies_and_images(): void
    {
        $project = Project::query()->create([
            'slug' => 'caso-demo',
            'title' => 'Caso demo',
            'summary' => 'Resumen de prueba.',
        ]);

        $technology = Technology::query()->create([
            'name' => 'Laravel',
            'slug' => 'laravel',
            'category' => Technology::CATEGORY_BACKEND,
        ]);

        $project->technologies()->attach($technology);

        $image = $project->images()->create([
            'path' => 'projects/caso-demo/cover.webp',
            'alt_text' => 'Caso demo',
            'is_cover' => true,
        ]);

        $project->refresh();

        $this->assertTrue($project->technologies->contains($technology));
        $this->assertTrue($technology->projects->contains($project));
        $this->assertTrue($project->images->contains($image));
        $this->assertTrue($image->project?->is($project));
        $this->assertTrue($image->is_cover);

        $projectId = $project->id;
        $project->delete();

        $this->assertDatabaseMissing('project_images', ['project_id' => $projectId]);
        $this->assertDatabaseMissing('project_technology', ['project_id' => $projectId]);
    }

    public function test_conversation_has_messages(): void
    {
        $conversation = DemoConversation::factory()->create();
        $message = DemoMessage::factory()->create([
            'conversation_id' => $conversation->id,
            'sender_type' => DemoMessage::SENDER_AGENT,
        ]);

        $conversation->refresh();

        $this->assertTrue($conversation->messages->contains($message));
        $this->assertTrue($message->conversation->is($conversation));

        $conversationId = $conversation->id;
        $conversation->delete();

        $this->assertDatabaseMissing('demo_messages', ['conversation_id' => $conversationId]);
    }

    public function test_database_seeder_populates_portfolio_data(): void
    {
        $this->seed();

        $this->assertDatabaseCount('technologies', 15);
        $this->assertDatabaseCount('projects', 9);
        $this->assertDatabaseCount('project_images', 32);
        $this->assertDatabaseCount('certifications', 2);
        $this->assertNull(
            Certification::query()->where('name', 'React para principiantes')->value('issuer'),
        );
        $this->assertDatabaseCount('demo_shipments', 15);
        $this->assertDatabaseCount('demo_notifications', 10);
        $this->assertDatabaseCount('demo_conversations', 5);
        $this->assertDatabaseCount('demo_messages', 20);

        $logistics = Project::query()->where('slug', 'saas-logistics-platform')->first();

        $this->assertNotNull($logistics);
        $this->assertTrue($logistics->is_featured);
        $this->assertTrue($logistics->technologies->contains('slug', 'laravel'));
        $this->assertTrue($logistics->images->first()?->is_cover);

        $this->assertSame(6, Project::query()->featured()->count());

        $conversation = DemoConversation::query()->withCount('messages')->first();

        $this->assertNotNull($conversation);
        $this->assertSame(4, $conversation->messages_count);
        $this->assertNotNull($conversation->last_message_at);
    }

    public function test_database_seeder_can_run_again_without_overwriting_content(): void
    {
        $this->seed();

        $project = Project::query()->where('slug', 'customer-support-desk')->firstOrFail();
        $project->update(['title' => 'Título editado en admin', 'is_published' => false]);
        $project->images()->delete();
        Certification::query()->where('name', 'React para principiantes')->update(['issuer' => 'Emisor editado']);

        $this->seed();

        $this->assertDatabaseCount('technologies', 15);
        $this->assertDatabaseCount('projects', 9);
        $this->assertDatabaseCount('project_images', 25);
        $this->assertDatabaseCount('certifications', 2);
        $this->assertDatabaseCount('demo_shipments', 15);
        $this->assertDatabaseCount('demo_notifications', 10);
        $this->assertDatabaseCount('demo_conversations', 5);
        $this->assertDatabaseCount('demo_messages', 20);

        $project->refresh();

        $this->assertSame('Título editado en admin', $project->title);
        $this->assertFalse($project->is_published);
        $this->assertSame(
            'Emisor editado',
            Certification::query()->where('name', 'React para principiantes')->value('issuer'),
        );
    }
}
