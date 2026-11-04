<?php

// El frontend ya no llama a esta API: lee y escribe Supabase directo.
// Se puede borrar api/ cuando Railway esté apagado y el sitio en Vercel esté verificado.
// Ver supabase/migrations y docs/deployment.md.

use App\Http\Controllers\Admin\CertificationController as AdminCertificationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ProjectImageController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Demo\ConversationController as DemoConversationController;
use App\Http\Controllers\Demo\NotificationController as DemoNotificationController;
use App\Http\Controllers\Demo\ShipmentController as DemoShipmentController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TechnologyController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project:slug}', [ProjectController::class, 'show']);
Route::get('/technologies', [TechnologyController::class, 'index']);
Route::get('/certifications', [CertificationController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');

Route::post('/login', [SessionController::class, 'store'])->middleware('throttle:5,1');
Route::post('/logout', [SessionController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/user', [SessionController::class, 'user'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->prefix('admin')->group(function (): void {
    Route::get('/dashboard', DashboardController::class);
    Route::get('/messages', [MessageController::class, 'index']);
    Route::get('/messages/{message}', [MessageController::class, 'show']);
    Route::patch('/messages/{message}', [MessageController::class, 'update']);
    Route::get('/projects', [AdminProjectController::class, 'index']);
    Route::post('/projects', [AdminProjectController::class, 'store']);
    Route::get('/projects/{project}', [AdminProjectController::class, 'show']);
    Route::match(['put', 'patch'], '/projects/{project}', [AdminProjectController::class, 'update']);
    Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy']);
    Route::post('/projects/{project}/images', [ProjectImageController::class, 'store']);
    Route::patch('/projects/{project}/images/{image}', [ProjectImageController::class, 'update']);
    Route::delete('/projects/{project}/images/{image}', [ProjectImageController::class, 'destroy']);
    Route::get('/certifications', [AdminCertificationController::class, 'index']);
    Route::post('/certifications', [AdminCertificationController::class, 'store']);
    Route::match(['put', 'patch'], '/certifications/{certification}', [AdminCertificationController::class, 'update']);
    Route::delete('/certifications/{certification}', [AdminCertificationController::class, 'destroy']);
});

Route::prefix('demo')->group(function (): void {
    Route::get('/shipments', [DemoShipmentController::class, 'index']);
    Route::get('/notifications', [DemoNotificationController::class, 'index']);
    Route::post('/notifications/{notification}/simulate', [DemoNotificationController::class, 'simulate']);
    Route::get('/conversations', [DemoConversationController::class, 'index']);
    Route::get('/conversations/{conversation}', [DemoConversationController::class, 'show']);
    Route::patch('/conversations/{conversation}', [DemoConversationController::class, 'update']);
});
