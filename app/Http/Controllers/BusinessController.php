<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


use Illuminate\Routing\Controller as BaseController;



class BusinessController extends BaseController
{
    
    protected $empresa;
    protected $empresa_id; 

     public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->empresa = Business::findOrFail(Auth::user()->empresa_id);
            $this->empresa_id = Auth::user()->empresa_id;
            return $next($request);
        });
    }

    
    public function index()
    {
        return Inertia::render("Business/Business",[
            "empresa"=>$this->empresa,
        ]);  
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Business $business)
    {
      return Business::where('id',$this->empresa_id)
                      ->selectRaw('nome_fantasia as label,id as value')
                      ->get();  
    
    
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Business $business)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Business $business)
    {
      $dados = $request->all();
      $this->empresa->update($dados);
      return redirect()->back()->with('success', 'Dados atualizados');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Business $business)
    {
        //
    }
}
