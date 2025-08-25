import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import PrimaryButton from '@/Components/PrimaryButton'
import Autocomplete from '@/Components/Autocomplete'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { Download, FileText, Search } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table'

export default function Individual () {
    const [filters, setFilters] = useState({
        funcionario: null,
        inicio: '',
        fim: ''
    })
    const [showTable, setShowTable] = useState(false)
    const [results, setResults] = useState([])

    const handleChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const pesquisar = async () => {
        // Mock temporário
        setResults([
            { id: 1, data: '2025-08-20', entrada: '08:00', saida: '17:00' },
            { id: 2, data: '2025-08-21', entrada: '09:00', saida: '18:00' }
        ])
        setShowTable(true)
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                    Ponto
                </h2>
            }
        >
            <Head title='Relatório Individual' />
            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white shadow-sm sm:rounded-lg p-6'>
                        {/* Formulário de pesquisa */}
                        <div className='grid grid-cols-12 gap-4 items-end'>
                            <div className='col-span-12 md:col-span-4'>
                                <InputLabel>Funcionário</InputLabel>
                                <Autocomplete
                                    name='funcionario'
                                    data={[]} // Preencher com lista real de funcionários
                                    value={filters.funcionario}
                                    onChange={value =>
                                        setFilters(prev => ({
                                            ...prev,
                                            funcionario: value
                                        }))
                                    }
                                />
                            </div>
                            <div className='col-span-6 md:col-span-3'>
                                <InputLabel>Data de Início</InputLabel>
                                <TextInput
                                    type='date'
                                    name='inicio'
                                    className='w-full'
                                    value={filters.inicio}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-6 md:col-span-3'>
                                <InputLabel>Data de Fim</InputLabel>
                                <TextInput
                                    type='date'
                                    name='fim'
                                    className='w-full'
                                    value={filters.fim}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 md:col-span-2 flex gap-2 '>
                                <div className='w-[50%]'>
                                    <PrimaryButton  className='w-full'  onClick={pesquisar}>
                                        <div className='flex flex-row gap-2 justify-center items-center text-center' >
                                             <div className='sm:[w-20%] min-w-auto' >
                                                 <Search/> 
                                             </div>

                                             <div className='w-[80%] md:hidden'>
                                               <span>Pesquisar</span>
                                             </div>  
                                       </div>
                                        
                                    </PrimaryButton>
                                </div>
                                 <div className='w-[50%]'>
                                    <PrimaryButton className='w-full'  onClick={pesquisar}>
                                        <Download />
                                    </PrimaryButton>
                                </div>

                               
                            </div>
                        </div>

                        {/* Tabela */}
                        {showTable && (
                            <div className='mt-6'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Chegada</TableHead>
                                            <TableHead>Almoço</TableHead>
                                            <TableHead>Retorno</TableHead>
                                            <TableHead>Saída</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    {row.data}
                                                </TableCell>
                                                <TableCell>
                                                    {row.entrada}
                                                </TableCell>
                                                <TableCell>
                                                    {row.entrada}
                                                </TableCell>
                                                <TableCell>
                                                    {row.entrada}
                                                </TableCell>
                                               
                                               
                                               
                                                <TableCell>
                                                    {row.saida}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
