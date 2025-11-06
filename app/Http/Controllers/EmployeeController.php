<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\ConstructionEmployee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;





class EmployeeController extends Controller
{
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

    public function store(Request $request)
    {
        $dados = $request->all();
        $dados["empresa_id"] = Auth::user()->empresa_id;
        $funcionario = Employee::create($dados);
        $payload = [
            "funcionario_id"=> $funcionario->id,
            "construcao_id"=> $dados['obra']
        ];
        $construction = ConstructionEmployee::create($payload);
        return redirect()->route('funcionarios');
    }

    
    public function generate(){
        $empresa_id = Auth::user()->empresa_id;
        $ultCodigo = Employee::where('empresa_id',$empresa_id)->max('codigo');
        $codigo = (int) $ultCodigo + 1;
        $codigoFormatado = str_pad($codigo, 4, '0', STR_PAD_LEFT);
        return response()->json(["codigo"=>$codigoFormatado]);   


    }
    
    public function autocompleteFuncionarios() {
       return Employee::where('empresa_id', Auth::user()->empresa_id)
            ->selectRaw('nome as label, id as value')
            ->get();        
    }
    


    public function show(Employee $employee)
    {        
        $employee->load('role');
        $constructions = ConstructionEmployee::where('funcionario_id',$employee->id)
        ->with('construction')
        ->get();
        return Inertia::render("Register/Employee/EmployeeInfo",[
        "funcionario"=>$employee,
        "obras_funcionario"=>$constructions
      ]);   
    }

    public function update(Request $request, Employee $employee)
    {
        $employee->update($request->all());
        return redirect()->route('funcionarios.show', $employee);
    }

    public function destroy(Employee $employee)
    {
        //
    }
}
