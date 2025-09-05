<?php

namespace App\Http\Controllers;

use App\Models\Ponto;
use App\Models\Construction;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Carbon\CarbonPeriod;


class PontoController extends Controller
{
   
    public function index(Construction $construction)
    {
        return Inertia::render("Ponto/ConstructionSelected",[
            "obra"=>$construction
        ]);
    }
    
    
    public function autocompleteStatus(){
        $enum_values = ['Atestado', 'Falta', 'Férias','Horário'];
        $formatted_values = collect($enum_values)->map(function ($value) {
        return [
              'value' => $value,
              'label' => ucwords(str_replace('_', ' ', $value))
            ];
        });

      return response()->json($formatted_values);

    }  
    

    public function ajustarPonto(Request $request){
       $inicio = Carbon::createFromFormat('Y-m-d', $request->inicio)->startOfDay();
       $fim    = Carbon::createFromFormat('Y-m-d', $request->fim)->endOfDay();
       $periodo = CarbonPeriod::create($inicio, $fim);
       $funcionario = Employee::findOrFail($request->funcionarioID);

       foreach ($periodo as $data) {
          Ponto::create([
            'funcionario_id' => $request->funcionarioID,
            'empresa_id'     => $funcionario->empresa_id,
            'obra_id'        => $request->obraID,
            'status'         => $request->valueStatus,
            'dia'           => $data->format('Y-m-d'),
          ]);
        }

        return response()->json(['message' => 'Pontos ajustados com sucesso']);
    }

    public function buscarHorario(Request $request){
        
        $ponto = Ponto::where('dia',$request->data)
                      ->where('funcionario_id',$request->funcionario)
                      ->first();
        
        
        if(!$ponto){
            return response()->json([
                'message'=>'Não foi encontrado ponto registrado para esse dia'
            ],204);
        }
        
        if($ponto->status != 'Registrado'){
            return response()->json([
                'status'=> $ponto->status,
                'chegada'=>"",
                'almoco'=>"",
                'retorno'=>"",
                'saida'=>"",
            ],203);
        }
        
        
        
        
        if ($ponto->status === 'Registrado') {
           return response()->json([
            'status'=> $ponto->status,
            'chegada'=>$ponto->chegada ? Carbon::parse($ponto->chegada)->format('H:i:s') : null,
            'almoco'=>$ponto->almoco ? Carbon::parse($ponto->almoco)->format('H:i:s') : null,
            'retorno'=>$ponto->retorno ? Carbon::parse($ponto->retorno)->format('H:i:s') : null,
            'saida'=>$ponto->saida ? Carbon::parse($ponto->saida)->format('H:i:s') : null
           ],200);  
         
        }
        
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
            "obra_id"=>$dados["obra_id"],
        ],
        [
            "status"=>"Registrado"
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








}
