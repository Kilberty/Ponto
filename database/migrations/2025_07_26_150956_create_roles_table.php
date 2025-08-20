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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('businesses','id');
            $table->string('nome',40);
            $table->string('descricao')->nullable();
            $table->integer('semanais');
            $table->boolean('segunda')->default(true);
            $table->boolean('terca')->default(true);
            $table->boolean('quarta')->default(true);
            $table->boolean('quinta')->default(true);
            $table->boolean('sexta')->default(true);
            $table->boolean('sabado')->default(false);
            $table->boolean('domingo')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
