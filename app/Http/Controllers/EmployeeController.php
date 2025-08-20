<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;





class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
     $query = Employee::where('empresa_id', Auth::user()->empresa_id)->with('role');

    if ($request->nome) {
        $query->where('nome', 'like', '%' . $request->nome . '%');
    }

    if ($request->codigo) {
        $query->where('codigo', 'like', '%' . $request->codigo . '%');
    }

    $funcionarios = $query->paginate(10)->withQueryString();

    return Inertia::render("Register/Employee/EmployeeList", [
        "funcionarios" => $funcionarios,
        "filters" => $request->only('nome', 'codigo'),
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
        $dados["empresa_id"] = Auth::user()->empresa_id;
        Employee::create($dados);
        return redirect()->route('funcionarios');
    }

    
    public function generate(){
        $empresa_id = Auth::user()->empresa_id;
        $ultCodigo = Employee::where('empresa_id',$empresa_id)->max('codigo');
        $codigo = (int) $ultCodigo + 1;
        $codigoFormatado = str_pad($codigo, 4, '0', STR_PAD_LEFT);
        return response()->json(["codigo"=>$codigoFormatado]);   


    }
    
    
    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {        
        $employee->load('role');
        return Inertia::render("Register/Employee/EmployeeInfo",[
        "funcionario"=>$employee
      ]);   
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $employee->update($request->all());
        return redirect()->route('funcionarios.show', $employee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
