<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ConstructionController;
use App\Http\Controllers\UfController;
use App\Http\Controllers\RoleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', []);
});



Route::get('/home', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::get('/register',function(){
    return Inertia::render('Auth/Register',[]);
});





Route::middleware('auth')->group(function () {
   Route::get('/empresa',[BusinessController::class,'index'])->name('empresa');
   Route::get('/build/ufs',[UfController::class,'index'])->name('uf');
   Route::get('/funcionarios',[EmployeeController::class,'index'])->name('funcionarios');
   Route::post('/funcionarios/adicionar',[EmployeeController::class,'store']);
   Route::get('/funcionarios/gerarCodigo',[EmployeeController::class,'generate']);
   Route::get('/funcionarios/{employee}',[EmployeeController::class,'show'])->name('funcionarios.show');
   Route::patch('/funcionarios/{employee}',[EmployeeController::class,'update']);
   Route::post('/empresa/update',[BusinessController::class,'update']);
   Route::get('/build/funcoes/autocomplete',[RoleController::class,'autocompleteNome']);
   Route::post('/funcoes/adicionar',[RoleController::class,'store']);
   Route::post('/funcoes/atualizar',[RoleController::class,'update']);
   Route::get('/funcoes',[RoleController::class,'index'])->name('funcoes');
   Route::get('/obras',[ConstructionController::class,'index'])->name('obras');
   Route::post('/obras/add',[ConstructionController::class,'store']);
   Route::patch('/obras/{construction}/descricao',[ConstructionController::class,'description']);
   Route::get('/obras/{construction}/descricao',[ConstructionController::class,'show']);
   Route::get('/build/obras/autocomplete',[ConstructionController::class,'autoCompleteConstruction']);
});

require __DIR__.'/auth.php';
