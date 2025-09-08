import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import TextInput from '@/Components/TextInput'
import PrimaryButton from '@/Components/PrimaryButton'
import DangerButton from '@/Components/DangerButton'
import { useState } from 'react'
import { Search, MenuIcon, PlusCircle, Trash } from 'lucide-react'
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
import Checkbox from '@/Components/Checkbox'
import { router, usePage } from '@inertiajs/react'
import Pagination from '@/Components/Pagination'
import AddUser from './AddUser'
export default function UserList () {
    const { usuarios, filters } = usePage().props

    const [filtroNome, setFiltroNome] = useState(filters?.nome || '')
    const [filtroEmail, setFiltroEmail] = useState(filters?.email || '')
    const aplicarFiltros = () => {
        router.visit(route('usuarios'), {
            method: 'get',
            data: {
                nome: filtroNome,
                email: filtroEmail
            },
            preserveScroll: true,
            preserveState: true
        })
    }

    const mudarPagina = page => {
        router.visit(route('usuarios'), {
            method: 'get',
            data: {
                ...filters,
                page
            },
            preserveScroll: true,
            preserveState: true
        })
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                        Usuários
                    </h2>
                    <div className='flex items-center gap-2'>
                        <AddUser>
                            <PrimaryButton>
                                <span className='sm:hidden'>
                                    <PlusCircle size={20} />
                                </span>
                                <span className='hidden sm:inline'>
                                    Adicionar
                                </span>
                            </PrimaryButton>
                        </AddUser>
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
            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white shadow-sm sm:rounded-lg p-6'>
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
                                    value={filtroNome}
                                    onChange={e =>
                                        setFiltroNome(e.target.value)
                                    }
                                />

                                <TextInput
                                    placeholder='Email'
                                    value={filtroEmail}
                                    onChange={e => {
                                        setFiltroEmail(e.target.value)
                                    }}
                                />

                                <PrimaryButton
                                    type='submit'
                                    className='sm:w-auto'
                                >
                                    <Search />
                                </PrimaryButton>
                            </div>
                        </form>

                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='text-center'>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead className='w-[10%] text-center '>
                                            ID
                                        </TableHead>
                                        <TableHead className='w-[35%] text-center'>
                                            Nome
                                        </TableHead>
                                        <TableHead className='text-center'>
                                            Email
                                        </TableHead>
                                        <TableHead className='text-center'>
                                            Menu
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usuarios.data.map(usuario => (
                                        <TableRow key={usuario.id}>
                                            <TableCell className='text-center'>
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                {usuario.id}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                {usuario.name}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                {usuario.email}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <MenuIcon />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side='right'>
                                                        <DropdownMenuItem>
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Ajustar Permissões
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Pagination
                                links={usuarios.links}
                                onPageChange={mudarPagina}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
