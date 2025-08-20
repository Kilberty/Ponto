<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
       protected $fillable = [
        'nome_fantasia',
        'razao_social',
        'cnpj',
        'cep',
        'rua',
        'bairro',
        'uf',
        'numero',
        'cidade',
        'email',
        'telefone_1',
        'telefone_2'
    ];
    


    public function business(){
        return $this->belongsTo(Business::class);
    }

     











}
