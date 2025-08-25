<?php

namespace App\Http\Controllers;

use App\Models\Ponto;
use App\Models\Construction;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class PontoController extends Controller
{
   
    public function index(Construction $construction)
    {
        return Inertia::render("Ponto/ConstructionSelected",[
            "obra"=>$construction
        ]);
    }

    public function store(Request $request)
    {
       $dados = $request->all();
       $funcionario = Employee::where('codigo',$dados['codigo'])->first();
       $data = now()->toDateString();
       $hora = now()->toTimeString();
       


       
        if (!isset($dados['codigo'])) {
            return response()->json(["message" => "Código do funcionário não fornecido."], 404);
        }



       
       $registro = Ponto::firstOrCreate(
        [
            "funcionario_id"=>$funcionario->id,
            "dia"=>$data,
            "empresa_id"=>$funcionario->empresa_id,
            "obra_id"=>$dados["obra_id"]
        ]
       ); 
    
    
        if(is_null($registro->chegada)){
            $registro->update(['chegada'=> now()]);
            return response()->json([
                "message"=>"Ponto batido com sucesso",
                "nome"=>$funcionario->nome,
                "codigo"=>$funcionario->codigo,
                "hora"=>$hora,
                "data"=>$data
            ],200);
        }
    
        if(is_null($registro->almoco)){
            $registro->update(['almoco'=> now()]);
            return response()->json([
                "message"=>"Ponto batido com sucesso",
                "nome"=>$funcionario->nome,
                "codigo"=>$funcionario->codigo,
                "hora"=>$hora,
                "data"=>$data
            ],200);
        }
       
        if(is_null($registro->retorno)){
            $registro->update(['retorno'=> now()]);
            return response()->json([
                "message"=>"Ponto batido com sucesso",
                "nome"=>$funcionario->nome,
                "codigo"=>$funcionario->codigo,
                "hora"=>$hora,
                "data"=>$data
            ],200);
        }
    
        if(is_null($registro->saida)){
            $registro->update(['saida'=> now()]);
            return response()->json([
                "message"=>"Ponto batido com sucesso",
                "nome"=>$funcionario->nome,
                "codigo"=>$funcionario->codigo,
                "hora"=>$hora,
                "data"=>$data
            ],200);
        }
    
        
    
       return response()->json([
        "message"=>"Todos os pontos do dia já foram batidos"
       ],403);
    
    
    
    }




    public function report(Request $request){
          $dados = $request->all();
         





    }




}
