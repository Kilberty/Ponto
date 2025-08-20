<?php

namespace App\Http\Controllers;

use App\Models\Construction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class ConstructionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $obras = Construction::where("empresa_id",Auth::user()->empresa_id)->with('ufData')->get(); 
       return Inertia::render("Register/Constructions/Constructions",[
        "obras"=>$obras
       ]);
    }

    public function autoCompleteConstruction(){
         return Construction::where('empresa_id', Auth::user()->empresa_id)
            ->selectRaw('nome as label,id as value')
            ->get();
    }
    
    
    
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $dados = $request->all();
      $dados['empresa_id'] = Auth::user()->empresa_id;
      Construction::create($dados);
      return redirect()->route('obras');
    
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Construction $construction)
    {
        return $construction;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Construction $construction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Construction $construction)
    {
        //
    }

    public function description(Request $request,Construction $construction){
       $construction->update($request->all());
       return redirect()->route('obras',$construction);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Construction $construction)
    {
        //
    }
}
