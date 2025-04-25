<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatisticsTable extends Migration
{
    public function up()
    {
        Schema::create('statistics', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->string('event')->nullable(); // اسم اکشن
            $table->timestamp('date')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('statistics');
    }
}
