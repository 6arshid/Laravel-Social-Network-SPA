<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('page_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_page_id')->constrained('user_pages')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_page_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('page_likes');
    }
};
