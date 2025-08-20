<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;


class uf extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ufs = [
            ['id_ibge' => 12, 'sigla' => 'AC', 'nome' => 'Acre'],
            ['id_ibge' => 27, 'sigla' => 'AL', 'nome' => 'Alagoas'],
            ['id_ibge' => 13, 'sigla' => 'AM', 'nome' => 'Amazonas'],
            ['id_ibge' => 16, 'sigla' => 'AP', 'nome' => 'Amapá'],
            ['id_ibge' => 29, 'sigla' => 'BA', 'nome' => 'Bahia'],
            ['id_ibge' => 23, 'sigla' => 'CE', 'nome' => 'Ceará'],
            ['id_ibge' => 53, 'sigla' => 'DF', 'nome' => 'Distrito Federal'],
            ['id_ibge' => 32, 'sigla' => 'ES', 'nome' => 'Espírito Santo'],
            ['id_ibge' => 52, 'sigla' => 'GO', 'nome' => 'Goiás'],
            ['id_ibge' => 21, 'sigla' => 'MA', 'nome' => 'Maranhão'],
            ['id_ibge' => 31, 'sigla' => 'MG', 'nome' => 'Minas Gerais'],
            ['id_ibge' => 50, 'sigla' => 'MS', 'nome' => 'Mato Grosso do Sul'],
            ['id_ibge' => 51, 'sigla' => 'MT', 'nome' => 'Mato Grosso'],
            ['id_ibge' => 15, 'sigla' => 'PA', 'nome' => 'Pará'],
            ['id_ibge' => 25, 'sigla' => 'PB', 'nome' => 'Paraíba'],
            ['id_ibge' => 26, 'sigla' => 'PE', 'nome' => 'Pernambuco'],
            ['id_ibge' => 22, 'sigla' => 'PI', 'nome' => 'Piauí'],
            ['id_ibge' => 41, 'sigla' => 'PR', 'nome' => 'Paraná'],
            ['id_ibge' => 33, 'sigla' => 'RJ', 'nome' => 'Rio de Janeiro'],
            ['id_ibge' => 24, 'sigla' => 'RN', 'nome' => 'Rio Grande do Norte'],
            ['id_ibge' => 43, 'sigla' => 'RS', 'nome' => 'Rio Grande do Sul'],
            ['id_ibge' => 11, 'sigla' => 'RO', 'nome' => 'Rondônia'],
            ['id_ibge' => 14, 'sigla' => 'RR', 'nome' => 'Roraima'],
            ['id_ibge' => 42, 'sigla' => 'SC', 'nome' => 'Santa Catarina'],
            ['id_ibge' => 28, 'sigla' => 'SE', 'nome' => 'Sergipe'],
            ['id_ibge' => 35, 'sigla' => 'SP', 'nome' => 'São Paulo'],
            ['id_ibge' => 17, 'sigla' => 'TO', 'nome' => 'Tocantins'],
        ];

        foreach ($ufs as $uf) {
            DB::table('ufs')->insert([
                'id_ibge'     => $uf['id_ibge'],
                'sigla'       => $uf['sigla'],
                'nome'        => $uf['nome'],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ]);
        }
    
    }   


}

