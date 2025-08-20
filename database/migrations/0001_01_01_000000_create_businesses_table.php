<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('cnpj',14)->unique();
            $table->string('nome_fantasia',100);
            $table->string('razao_social',100);
            $table->string('cep',8);
            $table->string('rua',100);
            $table->string('bairro',60);
            $table->string('uf',2);
            $table->string('numero',5);
            $table->string('cidade',60);
            $table->string('email',70)->nullable();
            $table->string('telefone_1',20)->nullable();
            $table->string('telefone_2',20)->nullable();    
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
