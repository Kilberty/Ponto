<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class ConstructionEmployee extends Model
{
  use SoftDeletes;
  protected $dates = ['deleted_at'];
  
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
