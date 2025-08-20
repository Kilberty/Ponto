<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        "nome",
        "empresa_id",
        "semanais",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado",
        "domingo"
    ];



  
    public function role(){
        return $this->belongsTo(Role::class);
    }

     






}
