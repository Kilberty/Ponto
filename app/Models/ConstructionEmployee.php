<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstructionEmployee extends Model
{
  protected $table = 'construction_employee';
  protected $fillable = [
      'construcao_id',
      'funcionario_id'
  ];
  

  public function construction(){
    return $this->belongsTo(Construction::class,'construcao_id');
  }

  public function employee(){
    return $this->belongsTo(Employee::class,'funcionario_id');
  }




}
