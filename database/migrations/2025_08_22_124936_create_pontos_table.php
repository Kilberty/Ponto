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
        Schema::create('pontos', function (Blueprint $table) {
            $table->id();
            $table->foreignId("empresa_id")->constrained("businesses","id");
            $table->foreignId("obra_id")->constrained("constructions","id");
            $table->foreignId("funcionario_id")->constrained("employees","id");
            $table->date("dia");
            $table->dateTime("chegada")->nullable();
            $table->dateTime("almoco")->nullable();
            $table->dateTime("retorno")->nullable();
            $table->dateTime("saida")->nullable();
            $table->enum('status',['Pendente','Registrado','Falta','Atestado','Feriado','Folga','Férias'])->default('Pendente');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pontos');
    }
};
