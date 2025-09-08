import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, usePage } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton'
import DangerButton from '@/Components/DangerButton'
import { PlusCircle, Trash, MenuIcon, Save, Search } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table'
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
import Checkbox from '@/Components/Checkbox'
import { useState } from 'react'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'
import Pagination from '@/Components/Pagination'

export default function Roles () {
    const { roles, filters } = usePage().props
    const [showModal, setShowModal] = useState(false)
    const [nome, setNome] = useState('')
    const [horas, setHoras] = useState('')
    const [editar, setEditar] = useState(false)
    const [idFuncao, setIdFuncao] = useState(0)
    const [errors, setErrors] = useState({})
    const [filtroNome, setFiltroNome] = useState(filters?.nome || '')

    const aplicarFiltros = () => {
        router.visit(route('funcoes'), {
            method: 'get',
            data: {
                nome: filtroNome
            },
            preserveScroll: true,
            preserveState: true
        })
    }

    const mudarPagina = (page) => {
        router.visit(route('funcoes'), {
            method: 'get',
            data: {
                ...filters,
                page
            },
            preserveScroll: true,
            preserveState: true
        })
    }

    const diasPadrao = {
        segunda: true,
        terca: true,
        quarta: true,
        quinta: true,
        sexta: true,
        sabado: false,
        domingo: false
    }

    const [diasSemana, setDiasSemana] = useState(diasPadrao)

    const checkChange = (dia, checked) => {
        setDiasSemana(prev => ({ ...prev, [dia]: checked }))
    }

    const Salvar = async () => {
        const error = {}
        if (!nome.trim()) {
            error.nome = 'Digite um nome.'
        }
        if (!String(horas).trim()) {
            error.horas = 'Digite uma quantidade de horas.'
        }

        if (Object.keys(error).length > 0) {
            setErrors(error)
            return
        }

        if (!editar) {
            const dias = diasSemana
            const payload = { nome, horas, dias }
            router.post('/funcoes/adicionar', payload, {
                onSuccess: () => {
                    setShowModal(false)
                    window.Swal.fire({
                        title: 'Sucesso!',
                        text: 'Função adicionada!',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    })
                    setNome('')
                    setHoras('')
                    setDiasSemana(diasPadrao)
                }
            })
        } else {
            const dias = diasSemana
            const id = idFuncao
            const payload = { nome, horas, dias, id }
            router.post('/funcoes/atualizar', payload, {
                onSuccess: () => {
                    setShowModal(false)
                    setNome('')
                    setHoras('')
                    setDiasSemana(diasPadrao)
                }
            })
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                        Funções
                    </h2>
                    <div className='flex items-center gap-2'>
                        <PrimaryButton
                            onClick={() => {
                                setEditar(false)
                                setShowModal(true)
                            }}
                        >
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
            <Head title='Funções' />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white shadow-sm sm:rounded-lg p-6'>
                        {/* Filtros */}
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

                                <PrimaryButton
                                    type='submit'
                                    className='sm:w-auto'
                                >
                                    <Search />
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Tabela */}
                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[5%]'>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead className='w-[5%]'>
                                            ID
                                        </TableHead>
                                        <TableHead className='w-[60%]'>
                                            Nome
                                        </TableHead>
                                        <TableHead className='text-center'>
                                            Horas Semanais
                                        </TableHead>
                                        <TableHead className='text-center'>
                                            Menu
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.map(role => (
                                        <TableRow key={role.id}>
                                            <TableCell>
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className='font-medium'>
                                                {role.id}
                                            </TableCell>
                                            <TableCell>{role.nome}</TableCell>
                                            <TableCell className='text-center'>
                                                {role.semanais}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <MenuIcon />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side='right'>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setEditar(true)
                                                                setShowModal(
                                                                    true
                                                                )
                                                                setIdFuncao(
                                                                    role.id
                                                                )
                                                                setNome(
                                                                    role.nome
                                                                )
                                                                setHoras(
                                                                    role.semanais
                                                                )
                                                                setDiasSemana(
                                                                    role.dias
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
                        </div>

                        {/* Paginação */}
                        <Pagination
                            links={roles.links}
                            onPageChange={mudarPagina}
                        />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Dialog
                open={showModal}
                onOpenChange={open => {
                    if (!open) {
                        setShowModal(false)
                        setErrors({})
                        setNome('')
                        setHoras('')
                        setDiasSemana(diasPadrao)
                    }
                }}
            >
                <DialogContent className='w-full max-w-md md:max-w-3xl p-4 sm:p-6'>
                    <DialogHeader>
                        <DialogTitle className='text-lg md:text-2xl'>
                            Função
                        </DialogTitle>
                        <DialogDescription className='text-sm text-muted-foreground'>
                            Adicione detalhes da função.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid grid-cols-1 md:grid-cols-12 gap-4 mt-4'>
                        <div className='md:col-span-8'>
                            <InputLabel>Nome</InputLabel>
                            <TextInput
                                value={nome}
                                onChange={e => {
                                    setNome(e.target.value)
                                }}
                                className='w-full'
                            />
                            <InputError
                                message={errors.nome}
                                className='mt-1'
                            />
                        </div>

                        <div className='md:col-span-4'>
                            <InputLabel>Horas Semanais</InputLabel>
                            <TextInput
                                className='w-full'
                                type='number'
                                value={horas}
                                onChange={e => {
                                    setHoras(e.target.value)
                                }}
                                onKeyDown={e => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault()
                                    }
                                }}
                            />
                            <InputError
                                message={errors.horas}
                                className='mt-1'
                            />
                        </div>

                        <div className='md:col-span-12'>
                            <InputLabel className='block mb-2'>
                                Dias da semana
                            </InputLabel>
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2'>
                                {Object.keys(diasSemana).map((dia) => (
                                    <div
                                        key={dia}
                                        className='flex items-center gap-2 text-sm'
                                    >
                                        <Checkbox
                                            checked={diasSemana[dia]}
                                            onChange={e =>
                                                checkChange(
                                                    dia,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span>
                                            {dia.charAt(0).toUpperCase() +
                                                dia.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <div className='justify-end flex flex-row gap-4'>
                            <PrimaryButton onClick={Salvar}>
                                <span className='sm:hidden'>
                                    <Save size={20} />
                                </span>
                                <span className='hidden sm:inline'>Salvar</span>
                            </PrimaryButton>

                            <DangerButton
                                onClick={() => setShowModal(false)}
                            >
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
