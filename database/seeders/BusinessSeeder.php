<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Business;

class BusinessSeeder extends Seeder
{
    public function run(): void
    {
        Business::insert([
        [
            'id'=>1,
            'cnpj' => '12345678000199',
            'nome_fantasia' => 'Empresa Teste',
            'razao_social' => 'Empresa Teste LTDA',
            'cep' => '12345678',
            'rua' => 'Rua Exemplo',
            'bairro' => 'Centro',
            'uf' => 'SP',
            'numero' => '100',
            'cidade' => 'São Paulo',
            'email' => 'contato@empresa.com',
            'telefone_1' => '(11) 1234-5678',
            'telefone_2' => '(11) 9876-5432',
        ],
        [
            'id'=>2,
            'cnpj' => '12345678000100',
            'nome_fantasia' => 'Empresa Teste',
            'razao_social' => 'Empresa Teste LTDA',
            'cep' => '12345678',
            'rua' => 'Rua Exemplo',
            'bairro' => 'Centro',
            'uf' => 'SP',
            'numero' => '100',
            'cidade' => 'São Paulo',
            'email' => 'contato@empresa.com',
            'telefone_1' => '(11) 1234-5678',
            'telefone_2' => '(11) 9876-5432',
        ]
    ]);
    }
}
