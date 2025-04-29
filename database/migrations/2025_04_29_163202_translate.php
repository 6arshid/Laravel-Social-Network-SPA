<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('language_id')->constrained();
            $table->string('key');
            $table->text('value');
            $table->timestamps();
            
            $table->unique(['language_id', 'key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('translations');
    }
};
