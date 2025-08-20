<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('businesses','id');
            $table->foreignId('funcao')->constrained('roles','id');
            $table->foreignId('uf')->nullable()->constrained('ufs','id');
            $table->foreignId('uf_rg')->nullable()->constrained('ufs','id');
            $table->string('cpf',11)->nullable()->unique();
            $table->string('rg',9)->nullable();
            $table->string('nome',60);
            $table->string('codigo',10);
            $table->string('nome_pai',60)->nullable();
            $table->string('nome_mae',60)->nullable();
            $table->string('cep',9)->nullable();
            $table->string('cidade',100)->nullable();
            $table->string('cidade_nascimento',100)->nullable();
            $table->date('data_nascimento')->nullable();
            $table->string('endereco',120)->nullable();
            $table->string('numero',5)->nullable();
            $table->string('bairro',100)->nullable();
            $table->string('complemento',100)->nullable();
            $table->string('email',100)->nullable();
            $table->string('pis',120)->nullable();
            $table->date('admissao')->nullable();
            $table->date('demissao')->nullable();
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
        Schema::dropIfExists('employees');
    }
};
