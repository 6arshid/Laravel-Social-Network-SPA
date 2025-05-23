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
     Schema::table('notifications', function (Blueprint $table) {
    $table->dropForeign(['user_id']);
    $table->dropColumn('user_id');

    $table->morphs('notifiable'); // notifiable_type و notifiable_id
    $table->timestamp('read_at')->nullable(); // جایگزین `read` boolean
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laravel_default', function (Blueprint $table) {
            //
        });
    }
};
