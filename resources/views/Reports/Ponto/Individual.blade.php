<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Ponto</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; margin: 20px; line-height: 1.2; color: #333; }
        h1 { text-align: center; margin-bottom: 15px; color: #2c3e50; font-size: 20px; font-weight: 600; }
        .header-info { background-color: #f8f9fa; padding: 8px 10px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e9ecef; box-shadow: 0 0 5px rgba(0,0,0,0.05); }
        .header-info p { margin: 2px 0; font-size: 13px; color: #555; }
        .header-info p strong { color: #000; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); border-radius: 6px; overflow: hidden; page-break-inside: auto; }
        thead { display: table-header-group; }
        th { background-color: #007bff; color: #fff; padding: 6px 4px; text-align: center; border: 1px solid #007bff; font-weight: bold; text-transform: uppercase; font-size: 11px; }
        td { border: 1px solid #e9ecef; padding: 6px 3px; text-align: center; font-size: 11px; color: #495057; }
        tbody tr:nth-child(even) { background-color: #f2f2f2; }
        td:nth-child(2) { text-align: left; white-space: normal; }
        tr { height: 18px; }
        .summary-table { width: 100%; margin-top: 30px; border-collapse: collapse; }
        .summary-table td { border: none; padding: 0; vertical-align: top; }
        .summary-table .totals-cell { text-align: left; width: 50%; }
        .summary-table .test-cell { text-align: right; width: 50%; }
    </style>
</head>
<body>
    <h1>Relatório de Ponto</h1>

    <div class="header-info">
        <p><strong>{{ $empresa->nome_fantasia }}</strong></p>
        <p><strong>Funcionário:</strong> {{ $funcionario->nome }}</p>
        <p><strong>Período:</strong> {{ date('d/m/Y', strtotime($inicio)) }} a {{ date('d/m/Y', strtotime($fim)) }}</p>
    </div>



    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Obra</th>
                <th>Chegada</th>
                <th>Almoço</th>
                <th>Retorno</th>
                <th>Saída</th>
                <th>Total Almoço</th>
                <th>Total Diário</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pontos['dias'] as $ponto)
                @php
                    $totalDiarioMinutos = $ponto['minutos_trabalhados'] ?? 0;
                    $tempoAlmoco = $ponto['total_almoco'] ?? 0;
                    $saldoMinutos = $ponto['saldo'] ?? 0;
                @endphp
                <tr>
                    <td>{{ $ponto['dia'] }}</td>
                    <td style="text-align:center;" >{{ $ponto['obra'] ?? '-' }}</td>
                    <td>{{ $ponto['chegada'] ?? '-' }}</td>
                    <td>{{ $ponto['almoco'] ?? '-' }}</td>
                    <td>{{ $ponto['retorno'] ?? '-' }}</td>
                    <td>{{ $ponto['saida'] ?? '-' }}</td>
                    <td>{{ $ponto['almoco_tempo'] ?? '-' }}</td>
                    <td>{{$ponto['diario']}}</td>
                    <td>{{ $ponto['status'] ?? 'Pendente' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="summary-table">
        <tr>
            <td class="totals-cell">
                <p><strong>Total Esperado:</strong> {{ $pontos['carga_esperada'] ?? '00:00' }}</p>
                <p><strong>Total Trabalhado:</strong> {{$pontos['carga_trabalhada'] ?? '00:00' }}</p>
                <p><strong>Saldo do Período:</strong> {{ $pontos['saldo_banco'] ?? '00:00' }}</p>
            </td>
            <td class="test-cell">
                <p>Teste</p>
            </td>
        </tr>
    </table>
</body>
</html>
