<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ponto extends Model
{

  protected $fillable = [
    "empresa_id",
    "funcionario_id",
    "obra_id",
    "dia",
    "chegada",
    "almoco",
    "retorno",
    "saida"
  ];



 public function employee(){
    return $this->belongsTo(Employee::class,"funcionario_id");
 }

 public function business(){
    return $this->belongsTo(Business::class,"empresa_id");
 }
 public function construction(){
    return $this->belongsTo(Construction::class,"obra_id");
 }


}
