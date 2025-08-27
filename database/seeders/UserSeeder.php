<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
        [
            'empresa_id' => 1, 
            'name' => 'Kilberty',
            'email' => 'kilberty1995@gmail.com',
            'password' => Hash::make('1234'),
        ],
        [    
            'empresa_id'=>2,
            'name'=>'Teste Público',
            'email'=>'teste@teste.com',
            'password'=> Hash::make('1234') 
        ]
    ]);
    }
}
