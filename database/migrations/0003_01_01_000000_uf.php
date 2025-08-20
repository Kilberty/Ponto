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
        Schema::create('ufs', function (Blueprint $table) {
         $table->id();
         $table->integer('id_ibge');
         $table->string('nome',50);
         $table->string('sigla',2)->unique();
         $table->timestamps();
         $table->softDeletes();
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ufs');
    }
};
