<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\Ponto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;


class Reports extends Controller
{
 public function PontoIndividual(){
   $dataInicio = Carbon::now()->startOfMonth()->toDateString();
   $dataFim = Carbon::now()->endOfMonth()->toDateString();  

   $funcionarios = Employee::where('empresa_id', Auth::user()->empresa_id)
            ->selectRaw('nome as label,id as value')
            ->get();
           
   return Inertia::render('Reports/Ponto/Individual',[
          "funcionarios"=>$funcionarios,
          "inicio"=>$dataInicio,
          "fim"=>$dataFim
   ]);


 }
 
  private function getPontosFormatados($funcionarioId, $inicio, $fim)
    {
        $pontos = Ponto::where('funcionario_id', $funcionarioId)
            ->whereBetween('dia', [$inicio, $fim])
            ->with('construction')
            ->get();

        return $pontos->map(function($ponto){
            return [
                "id" => $ponto->id,
                "dia" => Carbon::parse($ponto->dia)->format('d/m/Y'),
                "obra" => $ponto->construction->nome,
                "chegada" => $ponto->chegada ? Carbon::parse($ponto->chegada)->format('H:i:s') : null,
                "almoco" => $ponto->almoco ? Carbon::parse($ponto->almoco)->format('H:i:s') : null,
                "retorno" => $ponto->retorno ? Carbon::parse($ponto->retorno)->format('H:i:s') : null,
                "saida" => $ponto->saida ? Carbon::parse($ponto->saida)->format('H:i:s') : null,
            ];
        });
    }

  public function reportIndividual(Request $request){
    $dados = $request->query();
    $pontosFormatados = $this->getPontosFormatados($dados['id'],$dados['inicio'],$dados['fim']);
    return response()->json([
        "pontos" => $pontosFormatados
    ]);
  }

  
  public function pdfIndividual(Request $request){
    $dados = $request->query();
    $funcionario = Employee::findOrFail($dados['id']);
    $pontos = $this->getPontosFormatados($dados['id'],$dados['inicio'],$dados['fim']);
    
    $pdf = Pdf::loadView('Reports.Ponto.Individual', [
         'pontos' => $pontos,
         'funcionario' => $funcionario->nome,
         'inicio' => $dados['inicio'],
         'fim' => $dados['fim']
    ]);

    return $pdf->stream("relatorio_ponto_{$funcionario->id}.pdf");
  }






}
