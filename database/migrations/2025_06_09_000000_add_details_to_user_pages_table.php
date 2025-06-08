<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_pages', function (Blueprint $table) {
            $table->string('website')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('public_email')->nullable();
            $table->string('location')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('user_pages', function (Blueprint $table) {
            $table->dropColumn(['website', 'phone_number', 'public_email', 'location']);
        });
    }
};
