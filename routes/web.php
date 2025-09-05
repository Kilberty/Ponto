<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ConstructionController;
use App\Http\Controllers\ConstructionEmployeeController;
use App\Http\Controllers\PontoController;
use App\Http\Controllers\Reports;
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
   Route::get('/ufs',[UfController::class,'index'])->name('uf');
   Route::get('/funcionarios',[EmployeeController::class,'index'])->name('funcionarios');
   Route::post('/funcionarios/adicionar',[EmployeeController::class,'store']);
   Route::get('/funcionarios/gerarCodigo',[EmployeeController::class,'generate']);
   Route::get('/funcionarios/autocomplete',[EmployeeController::class,'autocompleteFuncionarios']);
   Route::get('/funcionarios/{employee}',[EmployeeController::class,'show'])->name('funcionarios.show');
   Route::patch('/funcionarios/{employee}',[EmployeeController::class,'update']);
   Route::post('/empresa/update',[BusinessController::class,'update']);
   Route::get('/funcoes/autocomplete',[RoleController::class,'autocompleteNome']);
   Route::post('/funcoes/adicionar',[RoleController::class,'store']);
   Route::post('/funcoes/atualizar',[RoleController::class,'update']);
   Route::get('/funcoes',[RoleController::class,'index'])->name('funcoes');
   Route::get('/obras',[ConstructionController::class,'index'])->name('obras');
   Route::delete('/obras/deleteFuncionario/{constructionEmployee}',[ConstructionEmployeeController::class,'delete'])->name('funcionario.delete');
   Route::post('/obras/addFuncionario',[ConstructionEmployeeController::class,'store']);
   Route::get('/obras/getFuncionario',[ConstructionEmployeeController::class,'index']);
   Route::post('/obras/add',[ConstructionController::class,'store']);
   Route::patch('/obras/{construction}/descricao',[ConstructionController::class,'description']);
   Route::get('/obras/{construction}/descricao',[ConstructionController::class,'show']);
   Route::get('/obras/autocomplete',[ConstructionController::class,'autoCompleteConstruction']);
   Route::post('/ponto/add',[PontoController::class,'store']);
   Route::get('/ponto/getHorario',[PontoController::class,'buscarHorario']);
   Route::get('/ponto/autocomplete',[PontoController::class,'autocompleteStatus']);
   Route::post('/ponto/ajuste',[PontoController::class,'ajustarPonto']);
   Route::get('/ponto/{construction}',[PontoController::class,'index'])->name('ponto');
   Route::get('/relatorios/ponto/individual',[Reports::class,'PontoIndividual']);
   Route::get('/relatorios/ponto/obra/pdf',[Reports::class,'pdfObra']);
   Route::get('/relatorios/ponto/individual/info',[Reports::class,'reportIndividual']);
   Route::get('/relatorios/ponto/individual/pdf',[Reports::class,'pdfIndividual']);
   
   Route::get('/relatorios',function(){
    return Inertia::render('Reports/Main');
   })->name('relatorios');



});

require __DIR__.'/auth.php';
