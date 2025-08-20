<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    $empresa_id = Auth::user()->empresa_id;

    $query = Role::where('empresa_id', $empresa_id);

    if ($request->nome) {
        $query->where('nome', 'like', '%' . $request->nome . '%');
    }

    $roles = $query->paginate(10)->withQueryString()->through(function ($role) {
        return [
            'id' => $role->id,
            'nome' => $role->nome,
            'semanais' => $role->semanais,
            'dias' => [
                'segunda' => $role->segunda,
                'terca' => $role->terca,
                'quarta' => $role->quarta,
                'quinta' => $role->quinta,
                'sexta' => $role->sexta,
                'sabado' => $role->sabado,
                'domingo' => $role->domingo,
            ],
         ];
        });

       return Inertia::render("Register/Roles/Roles", [
        "roles" => $roles,
        "filters" => $request->only('nome'),
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
        $dados = $request->all();
        $payload = [
            "nome" => $dados['nome'],
            "empresa_id" => Auth::user()->empresa_id,
            "semanais" => $dados['horas'],
            "segunda" => $dados['dias']['segunda'],
            "terca" => $dados['dias']['terca'],
            "quarta" => $dados['dias']['quarta'],
            "quinta" => $dados['dias']['quinta'],
            "sexta" => $dados['dias']['sexta'],
            "sabado" => $dados['dias']['sabado'],
            "domingo" => $dados['dias']['domingo']
        ];
        Role::create($payload);
        return redirect()->route('funcoes');
    }

    /**
     * Display the specified resource.
     */

    public function autocompleteNome()
    {
        return Role::where('empresa_id', Auth::user()->empresa_id)
            ->selectRaw('nome as label,id as value')
            ->get();
    }





    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $dados = $request->all();
        $id = $request->input('id');
        $role = Role::findOrFail($id);
        $payload = [
            "nome" => $dados['nome'],
            "empresa_id" => Auth::user()->empresa_id,
            "semanais" => $dados['horas'],
            "segunda" => $dados['dias']['segunda'],
            "terca" => $dados['dias']['terca'],
            "quarta" => $dados['dias']['quarta'],
            "quinta" => $dados['dias']['quinta'],
            "sexta" => $dados['dias']['sexta'],
            "sabado" => $dados['dias']['sabado'],
            "domingo" => $dados['dias']['domingo']
        ];
        $role->update($payload);
        return redirect()->route('funcoes');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
    }
}
