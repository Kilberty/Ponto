<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'empresa_id' => 1, // Certifique-se de que já existe um business com ID 1
            'name' => 'Kilberty',
            'email' => 'kilberty1995@gmail.com',
            'password' => Hash::make('1234'),
        ]);
    }
}
