import DangerButton from '@/Components/DangerButton'
import PrimaryButton from '@/Components/PrimaryButton'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage } from '@inertiajs/react'
import { PlusCircle, Trash, MenuIcon } from 'lucide-react'
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
import AddConstruction from './AddConstruction'
import AddDescription from './AddDescription'

export default function Constructions () {
    const { obras } = usePage().props

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                        Obras
                    </h2>
                    <div className='flex items-center gap-2'>
                        <AddConstruction>
                            <PrimaryButton>
                                <span className='sm:hidden'>
                                    <PlusCircle />
                                </span>
                                <span className='hidden sm:inline'>
                                    Adicionar
                                </span>
                            </PrimaryButton>
                        </AddConstruction>
                        <DangerButton>
                            <span className='sm:hidden'>
                                <Trash />
                            </span>
                            <span className='hidden sm:inline'>Excluir</span>
                        </DangerButton>
                    </div>
                </div>
            }
        >
            <Head title='Obras' />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white shadow-sm sm:rounded-lg p-6'>
                        <Table className='w-full table-fixed'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[5%]'>
                                        <Checkbox />
                                    </TableHead>
                                    <TableHead className='w-[10%]'>
                                        Nome
                                    </TableHead>
                                    <TableHead className='w-[35%] hidden sm:table-cell'>
                                        Descrição
                                    </TableHead>
                                    <TableHead className='w-[5%]'>UF</TableHead>
                                    <TableHead className='w-[15%]'>
                                        Município
                                    </TableHead>
                                    <TableHead className='w-[10%]'>
                                        Menu
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {obras.map(obra => (
                                    <TableRow key={obra.id}>
                                        <TableCell className='w-[5%]'>
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell className='w-[10%]'>
                                            {obra.nome}
                                        </TableCell>
                                        <TableCell className='w-[35%] truncate whitespace-nowrap overflow-hidden hidden sm:table-cell'>
                                            {obra.descricao}
                                        </TableCell>
                                        <TableCell className='w-[5%]'>
                                            {obra.uf_data.sigla}
                                        </TableCell>
                                        <TableCell className='w-[15%]'>
                                            {obra.cidade}
                                        </TableCell>
                                        <TableCell className='w-[10%]'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MenuIcon />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side='right'>
                                                    <DropdownMenuItem>
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <AddDescription
                                                        id={obra.id}
                                                    >
                                                        <DropdownMenuItem
                                                            onSelect={e =>
                                                                e.preventDefault()
                                                            }
                                                        >
                                                            Descrição
                                                        </DropdownMenuItem>
                                                    </AddDescription>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
