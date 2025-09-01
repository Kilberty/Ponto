<?php

namespace App\Http\Controllers;
use App\Models\ConstructionEmployee;
use Illuminate\Http\Request;

class ConstructionEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
      $dados = $request->query();

      $obras = ConstructionEmployee::where('funcionario_id', $dados['funcionario_id'])
        ->with('construction:id,nome')
        ->get()
        ->map(function ($item) {
            return [
                'label' => $item->construction->nome,
                'value' => $item->construction->id
            ];
        });

       return response()->json($obras);
    }


    public function store(Request $request)
    {
      $dados = $request->all();
      $exists = ConstructionEmployee::where('funcionario_id', $request->funcionario_id)
        ->where('construcao_id', $request->construcao_id)
        ->exists();

      if ($exists) {
        return back()->withErrors(['message' => 'Este funcionário já está vinculado a essa obra.']);
      }
      
      $constructions = ConstructionEmployee::create($dados);
      return redirect()->route('funcionarios.show',$dados['funcionario_id'] );
    }


    public function update(Request $request, ConstructionEmployee $constructionEmployee)
    {
        //
    }

 
    public function destroy(ConstructionEmployee $constructionEmployee)
    {
        //
    }
}
