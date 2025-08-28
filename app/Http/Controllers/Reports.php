<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\Ponto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;


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
 
private function getPontosFormatados($funcionarioId, $inicio, $fim, $perPage)
{
    $inicioDate = Carbon::createFromFormat('Y-m-d', $inicio)->startOfDay();
    $fimDate    = Carbon::createFromFormat('Y-m-d', $fim)->endOfDay();

    $pontos = Ponto::where('funcionario_id', $funcionarioId)
        ->whereBetween('dia', [$inicioDate->format('Y-m-d'), $fimDate->format('Y-m-d')])
        ->with('construction')
        ->orderBy('dia', 'asc')
        ->get()
        ->groupBy(fn($p) => Carbon::parse($p->dia)->format('Y-m-d'));

    $periodo = $inicioDate->daysUntil($fimDate->copy());
    $resultado = collect();

    foreach ($periodo as $dia) {
        $dataKey = $dia->format('Y-m-d');
        $pontoDoDia = $pontos->get($dataKey)?->first();

        $resultado->push([
            "id" => $pontoDoDia->id ?? null,
            "dia" => $dia->format('d-m-Y'),
            "obra" => $pontoDoDia->construction->nome ?? null,
            "chegada" => $pontoDoDia?->chegada ? Carbon::parse($pontoDoDia->chegada)->format('H:i:s') : null,
            "almoco" => $pontoDoDia?->almoco ? Carbon::parse($pontoDoDia->almoco)->format('H:i:s') : null,
            "retorno" => $pontoDoDia?->retorno ? Carbon::parse($pontoDoDia->retorno)->format('H:i:s') : null,
            "saida" => $pontoDoDia?->saida ? Carbon::parse($pontoDoDia->saida)->format('H:i:s') : null,
        ]);
    }

    // Aplica paginação somente se $perPage for definido
    if ($perPage) {
        $page = request()->get('page', 1);
        $items = $resultado->forPage($page, $perPage)->values();

        return new LengthAwarePaginator(
            $items,
            $resultado->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    return $resultado;
}





  public function reportIndividual(Request $request){
    $dados = $request->query();
    $pontosFormatados = $this->getPontosFormatados($dados['id'],$dados['inicio'],$dados['fim'],16);
    return response()->json([
        "pontos" => $pontosFormatados
    ]);
  }

  
  public function pdfIndividual(Request $request){
    $dados = $request->query();
    $funcionario = Employee::findOrFail($dados['id']);
    $pontos = $this->getPontosFormatados($dados['id'],$dados['inicio'],$dados['fim'],null);
    
    $pdf = Pdf::loadView('Reports.Ponto.Individual', [
         'pontos' => $pontos,
         'funcionario' => $funcionario->nome,
         'inicio' => $dados['inicio'],
         'fim' => $dados['fim']
    ]);

    return $pdf->stream("relatorio_ponto_{$funcionario->id}.pdf");
  }






}
