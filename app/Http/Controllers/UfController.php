<?php

namespace App\Http\Controllers;

use App\Models\Uf;
use Illuminate\Http\Request;

class UfController extends Controller
{
  public function index(){
      return Uf::selectRaw('sigla as label,id as value')->get();
  }


}
