<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\Business;
use App\Models\Role;
use App\Models\Ponto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;


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

    $funcionario = Employee::findOrFail($funcionarioId);
    $funcao = Role::findOrFail($funcionario->funcao);

    // Dias da semana que esse funcionário trabalha
    $diasTrabalho = [
        "segunda" => $funcao->segunda,
        "terca"   => $funcao->terca,
        "quarta"  => $funcao->quarta,
        "quinta"  => $funcao->quinta,
        "sexta"   => $funcao->sexta,
        "sabado"  => $funcao->sabado,
        "domingo" => $funcao->domingo
    ];

    $diasAtivos = array_keys(array_filter($diasTrabalho));
    $qtdDias = count($diasAtivos);

    // Jornada diária em minutos
    $horasDiarias = $funcao->semanais / $qtdDias;
    $totalMinutosDia = round($horasDiarias * 60);

    $diasSemana = [
        0 => 'domingo', 1 => 'segunda', 2 => 'terca',
        3 => 'quarta', 4 => 'quinta', 5 => 'sexta', 6 => 'sabado',
    ];

    $pontos = Ponto::where('funcionario_id', $funcionarioId)
        ->whereBetween('dia', [$inicioDate->format('Y-m-d'), $fimDate->format('Y-m-d')])
        ->with('construction')
        ->orderBy('dia', 'asc')
        ->get()
        ->groupBy(fn($p) => Carbon::parse($p->dia)->format('Y-m-d'));

    $periodo = $inicioDate->daysUntil($fimDate->copy());
    $dias = collect();

    // A contagem de dias esperados deve ser feita separadamente
    // antes do loop principal para evitar incluir dias de folga com ponto batido.
    $diasEsperados = 0;
    foreach ($periodo as $diaEsperado) {
        $nomeDia = $diasSemana[$diaEsperado->dayOfWeek];
        if (in_array($nomeDia, $diasAtivos)) {
            $pontoDoDia = $pontos->get($diaEsperado->format('Y-m-d'))?->first();
            // Apenas incrementa se não for um dia com status de atestado ou férias.
            if (!$pontoDoDia || !in_array($pontoDoDia->status, ['Atestado','Férias'])) {
               $diasEsperados++;
            }
        }
    }

    $totalMinutosTrabalhados = 0;
    // Loop principal para calcular os totais e formatar os dias
    $periodo = $inicioDate->daysUntil($fimDate->copy());
    foreach ($periodo as $dia) {
        $dataKey = $dia->format('Y-m-d');
        $pontoDoDia = $pontos->get($dataKey)?->first();
        $nomeDia = $diasSemana[$dia->dayOfWeek];
        $isDiaAtivo = in_array($nomeDia, $diasAtivos);
        $statusDia = null;

        if ($pontoDoDia) {
            $statusDia = $pontoDoDia->status;
        } elseif ($isDiaAtivo) {
            $statusDia = "Pendente";
        } else {
            $statusDia = "Folga";
        }

        $minutosDia = 0;
        $almocoDiario = 0;

        // Calcula os minutos trabalhados apenas se houver um registro de ponto.
        if ($pontoDoDia && !in_array($statusDia, ['Atestado', 'Férias'])) {
            // Chegada → Almoço
            if (!is_null($pontoDoDia->chegada) && !is_null($pontoDoDia->almoco)) {
                $expediente1 = round(Carbon::parse($pontoDoDia->almoco)->diffInMinutes(Carbon::parse($pontoDoDia->chegada)));
                $minutosDia += abs($expediente1);
            }

            // Retorno → Saída
            if (!is_null($pontoDoDia->retorno) && !is_null($pontoDoDia->saida)) {
                $expediente2 = round(Carbon::parse($pontoDoDia->saida)->diffInMinutes(Carbon::parse($pontoDoDia->retorno)));
                $minutosDia += abs($expediente2);
            }

            if(!is_null($pontoDoDia->almoco) && !is_null($pontoDoDia->retorno)){
                $almocoDiario = Carbon::parse($pontoDoDia->retorno)->diffInMinutes(Carbon::parse($pontoDoDia->almoco));
            }
        }

        // Soma os minutos trabalhados para o total do período.
        $totalMinutosTrabalhados += $minutosDia;

        // Total diário formatado HH:MM (nunca negativo)
        $horasDiaTrabalhadas = floor(abs($minutosDia) / 60);
        $minutosDiaTrabalhados = abs($minutosDia) % 60;
        $expedienteTotal = sprintf('%02d:%02d', $horasDiaTrabalhadas, $minutosDiaTrabalhados);

        $horasAlmoco = floor(abs($almocoDiario) / 60);
        $minutosAlmoco = abs($almocoDiario) % 60;
        $almocoFormatado = sprintf('%02d:%02d', $horasAlmoco, $minutosAlmoco);

        // Saldo diário = trabalhado - esperado.
        // O saldo diário deve ser calculado com base na jornada diária esperada.
        $diferenca = 0;
        if (in_array($nomeDia, $diasAtivos) && !in_array($statusDia, ['Atestado', 'Férias'])) {
            $diferenca = $minutosDia - $totalMinutosDia;
        } else {
            // Se for um dia de folga, o saldo é igual aos minutos trabalhados, pois a jornada esperada é zero.
            $diferenca = $minutosDia;
        }

        $dias->push([
            "id"                  => $pontoDoDia->id ?? null,
            "dia"                 => $dia->format('d/m/Y'),
            "obra"                => $pontoDoDia->construction->nome ?? null,
            "chegada"             => $pontoDoDia?->chegada ? Carbon::parse($pontoDoDia->chegada)->format('H:i') : null,
            "almoco"              => $pontoDoDia?->almoco ? Carbon::parse($pontoDoDia->almoco)->format('H:i') : null,
            "retorno"             => $pontoDoDia?->retorno ? Carbon::parse($pontoDoDia->retorno)->format('H:i') : null,
            "saida"               => $pontoDoDia?->saida ? Carbon::parse($pontoDoDia->saida)->format('H:i') : null,
            "almoco_tempo"        => $almocoFormatado,
            "minutos_trabalhados" => $minutosDia,
            "diario"              => $expedienteTotal,   // HH:MM do dia
            "saldo"               => $diferenca,         // pode ser negativo ou positivo
            "status"              => $statusDia,
            "funcao"              => $funcao,
        ]);
    }

    // Totais do período
    $minutosEsperados = $diasEsperados * $totalMinutosDia;
    $horasEsperadas = floor($minutosEsperados / 60);
    $minutosEsperadosFormatados = $minutosEsperados % 60;
    $cargaEsperada = sprintf('%02d:%02d', $horasEsperadas, $minutosEsperadosFormatados);

    $horasTrabalhadas = floor(abs($totalMinutosTrabalhados) / 60);
    $minutosTrabalhados = abs($totalMinutosTrabalhados) % 60;
    $cargaTrabalhada = sprintf('%02d:%02d', $horasTrabalhadas, $minutosTrabalhados);

    // Saldo de banco de horas (pode ser negativo ou positivo)
    $saldoBancoHorasMin = $totalMinutosTrabalhados - $minutosEsperados;
    $horasSaldo = floor(abs($saldoBancoHorasMin) / 60);
    $minutosSaldo = abs($saldoBancoHorasMin) % 60;
    $saldoBancoHoras = ($saldoBancoHorasMin < 0 ? '-' : '+') . sprintf('%02d:%02d', $horasSaldo, $minutosSaldo);

    $resultado = [
        'dias'             => $dias,
        'carga_esperada'   => $cargaEsperada,
        'carga_trabalhada' => $cargaTrabalhada,
        'saldo_banco'      => $saldoBancoHoras,
        'dias_trabalhados' => $diasEsperados,
    ];

    if ($perPage) {
        $page = request()->get('page', 1);
        $items = $dias->forPage($page, $perPage)->values();

        return new LengthAwarePaginator(
            $items,
            $dias->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    return $resultado;
}



  public function reportIndividual(Request $request){
    $dados = $request->query();
    $pontosFormatados = $this->getPontosFormatados($dados['id'],$dados['inicio'],$dados['fim'],11);
    return response()->json([
        "pontos" => $pontosFormatados
    ]);
  }

  
  public function pdfIndividual(Request $request){
    $dados = $request->query();
    $funcionario = Employee::findOrFail($dados['id']);
    $empresa = Business::findOrFail($funcionario->empresa_id);
    $pontos = $this->getPontosFormatados($dados['id'],$dados['inicio'],$dados['fim'],null);
    
    $pdf = Pdf::loadView('Reports.Ponto.Individual', [
         'pontos' => $pontos,
         'empresa'=>$empresa,
         'funcionario' => $funcionario,
         'inicio' => $dados['inicio'],
         'fim' => $dados['fim']
    ]);

    return $pdf->stream("relatorio_ponto_{$funcionario->id}.pdf");
  }






}
