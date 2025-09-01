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
        Schema::create('construction_employee', function (Blueprint $table) {
         $table->id();
         $table->foreignId('construcao_id')->constrained('constructions','id');
         $table->foreignId('funcionario_id')->constrained('employees','id');
         $table->timestamps();
         $table->softDeletes();
        
        });
    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('construction_employee');
    }
};
