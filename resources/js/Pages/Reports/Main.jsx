import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function Main () {
    return (
        <AuthenticatedLayout
            header={
                <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                    Relatórios
                </h2>
            }
        >
            <Head title='Relatórios' />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white shadow-sm sm:rounded-lg p-6'>
                        {/* Grid principal */}
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                            {/* Card genérico */}
                            <div className='col-span-1 flex flex-col justify-between rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md min-h-[220px]'>
                                <div className='p-5 flex-1'>
                                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                                        Ponto
                                    </h3>
                                    <ul className='space-y-2'>
                                        <li className='flex items-center'>
                                            <span className='mr-2 h-1.5 w-1.5 rounded-full bg-gray-500'></span>
                                            <Link
                                                href='/relatorios/ponto/individual'
                                                className='block rounded px-2 py-1 text-sm text-gray-800 hover:bg-gray-100 hover:text-black'
                                            >
                                                Ponto Individual
                                            </Link>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-2 h-1.5 w-1.5 rounded-full bg-gray-500'></span>
                                            <Link
                                                href='/relatorios/ponto/mensal'
                                                className='block rounded px-2 py-1 text-sm text-gray-800 hover:bg-gray-100 hover:text-black'
                                            >
                                                Ponto por Obra
                                            </Link>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>

                        

                       
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
