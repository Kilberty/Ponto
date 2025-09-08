<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;




class UserController extends Controller
{

    public function index(Request $request)
    {
        $empresa = Auth::user()->empresa_id;
        $query = User::where("empresa_id",$empresa);
                
              
        if($request->nome){
            $query->where('name','like','%' .$request->nome. '%' );
        } 
        
        if($request->email){
            $query->where('email','like','%' .$request->email. '%');
        }


        $users = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Register/Users/UserList',[
          "usuarios"=>$users,
          "filters"=>$request->only('nome','email')

        ]);
    }


    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $request->validate([
        'email' => 'required|email|max:255|unique:users,email',
      ]); 
      $dados = $request->all();
      $dados['empresa_id'] = Auth::user()->empresa_id;
      $dados['password'] = Hash::make($request->password);
      User::create($dados);

      return redirect()->route('usuarios');

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
