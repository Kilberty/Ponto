<!-- resources/views/Reports/Ponto/Individual.blade.php -->

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Ponto</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; margin: 20px; }
        h1 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        th { background-color: #f0f0f0; }
        .header-info { margin-bottom: 15px; }
        .header-info p { margin: 2px 0; }
    </style>
</head>
<body>
    <h1>Relatório de Ponto</h1>

    <div class="header-info">
        <p><strong>Funcionário:</strong> {{ $funcionario }}</p>
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
            </tr>
        </thead>
        <tbody>
            @foreach($pontos as $ponto)
                <tr>
                    <td>{{ $ponto['dia'] }}</td>
                    <td>{{ $ponto['obra'] }}</td>
                    <td>{{ $ponto['chegada'] ?? '-' }}</td>
                    <td>{{ $ponto['almoco'] ?? '-' }}</td>
                    <td>{{ $ponto['retorno'] ?? '-' }}</td>
                    <td>{{ $ponto['saida'] ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
