<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Role;

class Employee extends Model
{
    protected $fillable = [
    'empresa_id',
    'funcao',
    'cpf',
    'rg',
    'uf_rg',
    'nome',
    'codigo',
    'nome_pai',
    'nome_mae',
    'cep',
    'cidade_nascimento',
    'data_nascimento',
    'endereco',
    'numero',
    'bairro',
    'complemento',
    'email',
    'pis',
    'telefone_1',
    'telefone_2',
    'uf',
    'cidade',  
    'admissao',
    'demissao',
];


 public function employee(){
    return $this->belongsTo(Employee::class);
 }
 
 public function role(){
    return $this->belongsTo(Role::class,'funcao');
 }




}
