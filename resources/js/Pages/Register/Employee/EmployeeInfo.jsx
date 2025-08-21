import api from '@/api'
import Autocomplete from '@/Components/Autocomplete'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import PrimaryButton from '@/Components/PrimaryButton'
import { ArrowLeft, Save, Search } from 'lucide-react'
import mask from '@/mask'
import { consultarCep } from '@/utils'
import InputError from '@/Components/InputError'

export default function EmployeeInfo () {
    const { funcionario } = usePage().props
    const [nomeFuncoes, setNomeFuncoes] = useState([])
    const [ufs, setUfs] = useState([])
    const form = useForm({ ...funcionario })
    const [errors, setErrors] = useState({})
    const update = () => {
        const error = {}
        if (!form.data.nome) {
            error.nome = 'Digite um nome.'
        }
        if (!form.data.funcao) {
            error.funcao = 'Defina uma função.'
        }

        if (Object.keys(error).length > 0) {
            setErrors(error)
            return
        }

        form.patch(`/funcionarios/${funcionario.id}`, {
            onSuccess: () => {
                alert('Dados atualizados com sucesso!')
            },
            onError: error => {
                console.log(error)
            }
        })
    }



    const handleChange = e => {
        const { name, value } = e.target
        form.setData(prev => ({ ...prev, [name]: value }))

        if (errors[name] && value.trim() !== '') {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }
    const background =
        'w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:ring-0 transition-colors duration-200 ease-in-out'

    useEffect(() => {
        setErrors({})
        api.get('/funcoes/autocomplete').then(res => {
            setNomeFuncoes(res.data)
        })

        api.get('/ufs').then(res => {
            setUfs(res.data)
        })
    }, [])

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                        Funcionário
                    </h2>
                    <div className='flex items-center gap-2'>
                        <PrimaryButton onClick={()=>{
                          router.visit('/funcionarios')
                        }}>
                            <span className='sm:hidden'>
                                <ArrowLeft />
                            </span>
                            <span className='hidden sm:inline'>Voltar</span>
                        </PrimaryButton>

                        <PrimaryButton onClick={update}>
                            <span className='sm:hidden'>
                                <Save />
                            </span>
                            <span className='hidden sm:inline'>Salvar</span>
                        </PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title='Funcionários' />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white shadow-sm sm:rounded-lg p-6'>
                        <div className='grid grid-cols-12 gap-4'>
                            <div className=' col-span-12 md:hidden'>
                                <InputLabel>Nome</InputLabel>
                                <TextInput
                                    name='nome'
                                    className='w-full'
                                    value={form.data.nome}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='col-span-2  md:col-span-1'>
                                <InputLabel>ID</InputLabel>
                                <TextInput
                                    className='w-full'
                                    value={funcionario.id}
                                    readOnly
                                />
                            </div>
                            <div className='hidden sm:block  md:col-span-7'>
                                <InputLabel>Nome</InputLabel>
                                <TextInput
                                    className='w-full'
                                    name='nome'
                                    onChange={handleChange}
                                    value={form.data.nome}
                                />
                                <InputError
                                    message={errors.nome}
                                    className='mt-1'
                                />
                            </div>
                            <div className=' col-span-6 md:col-span-2'>
                                <InputLabel>Função</InputLabel>
                                <Autocomplete
                                    data={nomeFuncoes}
                                    name='funcao'
                                    onChange={(value, item) => {
                                        form.setData('funcao', value || null)
                                        if (errors.funcao && value) {
                                            setErrors(prev => ({
                                                ...prev,
                                                funcao: null
                                            }))
                                        }
                                    }}
                                    value={form.data.role?.id}
                                />
                                <InputError
                                    message={errors.funcao}
                                    className='mt-1'
                                />
                            </div>
                            <div className=' col-span-4 md:col-span-2'>
                                <InputLabel>Código</InputLabel>
                                <TextInput
                                    className='w-full'
                                    value={funcionario.codigo}
                                    readOnly
                                />
                            </div>

                            <div className='col-span-6 md:col-span-2'>
                                <InputLabel>Data de Admissão</InputLabel>
                                <TextInput
                                    type='date'
                                    name='admissao'
                                    className='w-full'
                                    onChange={handleChange}
                                    value={form.data.admissao}
                                />
                            </div>

                            <div className='col-span-6 md:col-span-2'>
                                <InputLabel>Data de Demissão</InputLabel>
                                <TextInput
                                    type='date'
                                    className='w-full'
                                    name='demissao'
                                    onChange={handleChange}
                                    value={form.data.demissao}
                                />
                            </div>
                        </div>
                        <div className='mt-6'>
                            <Tabs defaultValue='pessoais' className='w-full'>
                                <TabsList className='inline-flex w-full bg-gray-100 rounded-md p-1 overflow-hidden border border-gray-200'>
                                    <TabsTrigger
                                        value='pessoais'
                                        className={background}
                                    >
                                        Informações Pessoais
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value='endereco'
                                        className={background}
                                    >
                                        Endereço
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value='pessoais' className='mt-4 '>
                                    <div className='grid grid-cols-12 gap-2 '>
                                        <div className='col-span-5 md:col-span-2'>
                                            <InputLabel>CPF</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='cpf'
                                                onChange={e => {
                                                    const value = mask.unmask(
                                                        e.target.value
                                                    )
                                                    form.setData('cpf', value)
                                                }}
                                                value={mask.cpf(form.data.cpf)}
                                            ></TextInput>
                                        </div>
                                        <div className='hidden col-span-7 sm:block'></div>
                                        <div className='col-span-3 md:col-span-1 '>
                                            <InputLabel>UF RG</InputLabel>
                                            <Autocomplete
                                                data={ufs}
                                                value={form.data.uf_rg}
                                                onChange={(value, item) => {
                                                    form.setData('uf_rg', value)
                                                }}
                                            />
                                        </div>
                                        <div className='col-span-4 md:col-span-2 '>
                                            <InputLabel>RG</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='rg'
                                                onChange={handleChange}
                                                value={form.data.rg}
                                            ></TextInput>
                                        </div>
                                        <div className='col-span-6  md:col-span-2'>
                                            <InputLabel>
                                                Data de Nascimento
                                            </InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='data_nascimento'
                                                onChange={handleChange}
                                                value={
                                                    form.data.data_nascimento
                                                }
                                                type='date'
                                            />
                                        </div>
                                        <div className='col-span-6 md:col-span-6'>
                                            <InputLabel>
                                                Cidade de Nascimento
                                            </InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='cidade_nascimento'
                                                onChange={handleChange}
                                                value={
                                                    form.data.cidade_nascimento
                                                }
                                            ></TextInput>
                                        </div>

                                        <div className='col-span-6 md:col-span-2'>
                                            <InputLabel>Telefone 1</InputLabel>
                                            <TextInput
                                                className='w-full telefone8 telefone9'
                                                name='telefone_1'
                                                onChange={e => {
                                                    const value = mask.unmask(
                                                        e.target.value
                                                    )
                                                    form.setData(
                                                        'telefone_1',
                                                        value
                                                    )
                                                }}
                                                value={mask.telefone(
                                                    form.data.telefone_1
                                                )}
                                            ></TextInput>
                                        </div>
                                        <div className='col-span-6 md:col-span-2'>
                                            <InputLabel>Telefone 2</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='telefone_2'
                                                onChange={e => {
                                                    const value = mask.unmask(
                                                        e.target.value
                                                    )
                                                    form.setData(
                                                        'telefone_2',
                                                        value
                                                    )
                                                }}
                                                value={mask.telefone(
                                                    form.data.telefone_2
                                                )}
                                            ></TextInput>
                                        </div>
                                        <div className='col-span-12 md:col-span-6'>
                                            <InputLabel>Nome Pai</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='nome_pai'
                                                onChange={handleChange}
                                                value={form.data.nome_pai}
                                            ></TextInput>
                                        </div>
                                        <div className='col-span-12 md:col-span-6'>
                                            <InputLabel>Nome Mãe</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='nome_mae'
                                                onChange={handleChange}
                                                value={form.data.nome_mae}
                                            ></TextInput>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value='endereco'
                                    className='mt-4  '
                                >
                                    <div className='grid grid-cols-12 gap-3'>
                                        <div className='col-span-6 md:col-span-2'>
                                            <InputLabel>CEP</InputLabel>
                                            <div className='flex gap-2'>
                                                <TextInput
                                                    className='w-full'
                                                    name='cep'
                                                    onChange={e => {
                                                        const value =
                                                            e.target.value
                                                        form.setData(
                                                            'cep',
                                                            value
                                                        )
                                                    }}
                                                    value={mask.cep(
                                                        form.data.cep
                                                    )}
                                                />
                                                <PrimaryButton
                                                    onClick={ async ()=>{
                                                      const data = await consultarCep(form.data.cep,ufs)
                                                      if(data){
                                                        form.setData(prev=>({...prev,...data}))
                                                      }
                                                    }}
                                                    className='px-3 py-2'
                                                >
                                                    <Search size={18} />
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                        <div className=' hidden sm:block md:col-span-9'>
                                            <InputLabel>Endereco</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='endereco'
                                                onChange={handleChange}
                                                value={form.data.endereco}
                                            />
                                        </div>
                                        <div className=' hidden sm:block md:col-span-1'>
                                            <InputLabel>Número</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='numero'
                                                onChange={handleChange}
                                                value={form.data.numero}
                                            />
                                        </div>

                                        <div className='col-span-6 md:col-span-4'>
                                            <InputLabel>Bairro</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='bairro'
                                                onChange={handleChange}
                                                value={form.data.bairro}
                                            />
                                        </div>

                                        <div className='col-span-9 md:col-span-7'>
                                            <InputLabel>Municipio</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='cidade'
                                                onChange={handleChange}
                                                value={form.data.cidade}
                                            />
                                        </div>
                                        <div className='col-span-3 md:col-span-1'>
                                            <InputLabel>UF</InputLabel>
                                            <Autocomplete
                                                data={ufs}
                                                value={form.data.uf}
                                                onChange={(value, item) => {
                                                    form.setData(
                                                        'uf',
                                                        value || null
                                                    )
                                                }}
                                            />
                                        </div>
                                        <div className='col-span-9 md:hidden'>
                                            <InputLabel>Endereco</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                name='endereco'
                                                onChange={handleChange}
                                                value={form.data.endereco}
                                            />
                                        </div>
                                        <div className='col-span-3 md:hidden'>
                                            <InputLabel>Numero</InputLabel>
                                            <TextInput
                                                className='w-full'
                                                onChange={handleChange}
                                                name='numero'
                                                value={funcionario.numero}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
