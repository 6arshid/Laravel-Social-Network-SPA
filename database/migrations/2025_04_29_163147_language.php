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
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name');    // نام زبان (مثلاً English, فارسی)
            $table->string('code')->unique();   // کد زبان (مثلاً en, fa) یکتا باشد
            $table->enum('direction', ['LTR', 'RTL'])->default('LTR'); // جهت متن
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('languages');
    }




};
