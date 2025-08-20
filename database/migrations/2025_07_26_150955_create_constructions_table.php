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
        Schema::create('constructions', function (Blueprint $table) {
            $table->id();
            $table->foreignId("empresa_id")->constrained("businesses","id");
            $table->foreignId('uf')->nullable()->constrained('ufs','id');
            $table->string('nome',100)->unique();
            $table->string('cep',9)->nullable();
            $table->string('cidade',100)->nullable();
            $table->string('endereco',120)->nullable();
            $table->string('numero',5)->nullable();
            $table->string('bairro',100)->nullable();
            $table->longtext('descricao')->nullable();
            $table->timestamps();
            $table->softDeletes();        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constructions');
    }
};
