<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('message');
            $table->string('link')->nullable();
            $table->boolean('read')->default(false);
            $table->string('type')->default('general');
            $table->json('data')->nullable();
            $table->morphs('notifiable'); // notifiable_type و notifiable_id
            $table->timestamp('read_at')->nullable(); // جایگزین `read` boolean
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
