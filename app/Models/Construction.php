<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Construction extends Model
{
   use SoftDeletes;

    protected $table = 'constructions';

    protected $fillable = [
        'empresa_id',
        'uf',
        'nome',
        'cep',
        'cidade',
        'endereco',
        'numero',
        'bairro',
        'descricao',
    ];

    /**
     * Empresa associada (empresa_id → businesses.id)
     */
    public function empresa()
    {
        return $this->belongsTo(Business::class, 'empresa_id');
    }

    /**
     * UF associada (uf → ufs.id)
     */
    public function ufData()
    {
        return $this->belongsTo(Uf::class, 'uf');
    }
}
