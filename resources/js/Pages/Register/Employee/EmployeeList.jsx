import DangerButton from '@/Components/DangerButton'
import PrimaryButton from '@/Components/PrimaryButton'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, usePage } from '@inertiajs/react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table'
import Checkbox from '@/Components/Checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/Components/ui/dialog'
import api from '@/api'
import { MenuIcon, PlusCircle, Save, Trash, Dice6, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import Autocomplete from '@/Components/Autocomplete'

export default function EmployeeList () {
    const { funcionarios, filters } = usePage().props

    const [showModal, setShowModal] = useState(false)
    const [nome_funcoes, setNomeFuncoes] = useState([])
    const [obras_nome,setObrasNome] = useState([])
    const [obra,setObra] = useState([])
    const [nome, setNome] = useState('')
    const [codigo, setCodigo] = useState('')
    const [funcao, setFuncao] = useState(0)
    const [filtroNome, setFiltroNome] = useState(filters?.nome || '')
    const [filtroCodigo, setFiltroCodigo] = useState(filters?.codigo || '')

    const salvar = () => {
        const payload = { nome, codigo, funcao,obra }
        router.post('/funcionarios/adicionar', payload, {
            onSuccess: () => {
                setShowModal(false)
                window.Swal.fire({
                    title: 'Sucesso!',
                    text: 'Funcionário Adicionado!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                })
                setNome('')
                setCodigo('')
                setFuncao('')
            }
        })
    }

    const gerarCodigo = () => {
        api.get('/funcionarios/gerarCodigo')
            .then(response => setCodigo(response.data.codigo))
            .catch(console.log)
    }

    const aplicarFiltros = () => {
        router.visit(route('funcionarios'), {
            method: 'get',
            data: {
                nome: filtroNome,
                codigo: filtroCodigo
            },
            preserveScroll: true,
            preserveState: true
        })
    }

    useEffect(() => {
        api.get('/funcoes/autocomplete').then(res => {
            setNomeFuncoes(res.data)
        })

        api.get('/obras/autocomplete').then(res=>{
             setObrasNome(res.data)
        })
    }, [])

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                        Funcionários
                    </h2>
                    <div className='flex items-center gap-2'>
                        <PrimaryButton onClick={() => setShowModal(true)}>
                            <span className='sm:hidden'>
                                <PlusCircle size={20} />
                            </span>
                            <span className='hidden sm:inline'>Adicionar</span>
                        </PrimaryButton>
                        <DangerButton>
                            <span className='sm:hidden'>
                                <Trash size={20} />
                            </span>
                            <span className='hidden sm:inline'>Excluir</span>
                        </DangerButton>
                    </div>
                </div>
            }
        >
            <Head title='Funcionários' />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white shadow-sm sm:rounded-lg p-6'>
                        {/* 🔍 Filtros */}
                        <form
                            onSubmit={e => {
                                e.preventDefault()
                                aplicarFiltros()
                            }}
                            className='w-full flex flex-col sm:flex-row items-start gap-2 mb-6'
                        >
                            <div className='flex flex-row gap-2 w-full flex-wrap md:flex-nowrap'>
                                <TextInput
                                    placeholder='Nome'
                                    className='md:w-[30%]'
                                    value={filtroNome}
                                    onChange={e =>
                                        setFiltroNome(e.target.value)
                                    }
                                />
                                <TextInput
                                    placeholder='Código'
                                    className='hidden sm:block md:w-[20%]'
                                    value={filtroCodigo}
                                    onChange={e =>
                                        setFiltroCodigo(e.target.value)
                                    }
                                />
                                <PrimaryButton
                                    type='submit'
                                    className='sm:w-auto'
                                >
                                    <Search />
                                </PrimaryButton>
                            </div>
                        </form>
                        {/* 🧾 Tabela */}
                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='hidden md:table-cell w-[5%]'>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead className='w-[10%]'>
                                            ID
                                        </TableHead>
                                        <TableHead className='w-[50%]'>
                                            Nome
                                        </TableHead>
                                        <TableHead className='hidden md:table-cell'>
                                            Função
                                        </TableHead>
                                        <TableHead className='hidden md:table-cell text-center'>
                                            Código
                                        </TableHead>
                                        <TableHead className='text-center'>
                                            Menu
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {funcionarios.data.map(funcionario => (
                                        <TableRow key={funcionario.id}>
                                            <TableCell className='hidden md:table-cell'>
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className='font-medium'>
                                                {funcionario.id}
                                            </TableCell>
                                            <TableCell>
                                                {funcionario.nome}
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>
                                                {funcionario.role?.nome}
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell text-center'>
                                                {funcionario.codigo}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <MenuIcon />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side='right'>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                router.get(
                                                                    `/funcionarios/${funcionario.id}`
                                                                )
                                                            }}
                                                        >
                                                            Editar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Paginação */}
                            <div className='mt-6 flex justify-center flex-wrap gap-2'>
                                {funcionarios.links?.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url &&
                                            router.visit(link.url, {
                                                preserveScroll: true,
                                                preserveState: true
                                            })
                                        }
                                        className={`px-3 py-1 rounded text-sm
                ${
                    link.active
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                }
            `}
                                    >
                                        {link.label.includes('Previous') ||
                                        link.label.includes('Anterior')
                                            ? '←'
                                            : link.label.includes('Next') ||
                                              link.label.includes('Próximo')
                                            ? '→'
                                            : link.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Dialog
                open={showModal}
                onOpenChange={() => {
                    setShowModal(false)
                    setCodigo('')
                    setNome('')
                }}
            >
                <DialogContent 
                className='w-full max-w-md md:max-w-3xl'>
                    <DialogHeader>
                        <DialogTitle>Cadastrar Funcionário</DialogTitle>
                        <DialogDescription>
                            Adicione informações do funcionário.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
                        <div className='md:col-span-12'>
                            <InputLabel>Nome: </InputLabel>
                            <TextInput
                                className='w-full'
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                            />
                        </div>
                        
                          <div className='md:col-span-5'>
                            <InputLabel>Obra: </InputLabel>
                            <Autocomplete
                                data={obras_nome}
                                value={obra}
                                onChange={value => setObra(value)}
                            />
                        </div>
                        
                        
                        
                        
                        
                        <div className='md:col-span-3'>
                            <InputLabel>Função: </InputLabel>
                            <Autocomplete
                                data={nome_funcoes}
                                value={funcao}
                                onChange={value => setFuncao(value)}
                            />
                        </div>
                        <div className='md:col-span-4'>
                            <InputLabel>Código: </InputLabel>
                            <div className='flex flex-row gap-2'>
                                <TextInput
                                    className='w-full'
                                    value={codigo}
                                    onChange={e => setCodigo(e.target.value)}
                                />
                                <PrimaryButton onClick={gerarCodigo}>
                                    <Dice6 />
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <div className='justify-end flex flex-row gap-4'>
                            <PrimaryButton onClick={salvar}>
                                <span className='sm:hidden'>
                                    <Save size={20} />
                                </span>
                                <span className='hidden sm:inline'>Salvar</span>
                            </PrimaryButton>
                            <DangerButton onClick={() => setShowModal(false)}>
                                <span className='sm:hidden'>
                                    <Trash size={20} />
                                </span>
                                <span className='hidden sm:inline'>
                                    Cancelar
                                </span>
                            </DangerButton>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    )
}
