import Autocomplete from '@/Components/Autocomplete'
import DangerButton from '@/Components/DangerButton'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from '@/Components/ui/dialog'
import { Save, Search, Trash } from 'lucide-react'
import api from '@/api'
import { useEffect, useState } from 'react'
import InputError from '@/Components/InputError'
import mask from '@/mask'

export default function Fix ({ children }) {
    const hoje = new Date().toISOString().split('T')[0]
    const [funcionarios, setFuncionarios] = useState([])
    const [status, setStatus] = useState([])
    const [funcionarioID, setFuncionarioID] = useState('')
    const [obraID, setObraID] = useState('')
    const [valueStatus, setValueStatus] = useState('')
    const [inicio, setInicio] = useState(hoje)
    const [fim, setFim] = useState(hoje)
    const [obras, setObras] = useState([])
    const [errors, setErrors] = useState({})
    const [open, setOpen] = useState(false)
    const [data, setData] = useState('')
    const [pontoID, setPontoID] = useState('')

    const [horas, setHoras] = useState({
        chegada: '',
        almoco: '',
        retorno: '',
        saida: ''
    })

    const handleChangeHoras = e => {
        const { name, value } = e.target
        console.log(name)
        console.log(value)
        setHoras(prev => ({ ...prev, [name]: value }))
    }

    const validarHora = hora => {
        const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
        return regex.test(hora)
    }

    const resetForm = () => {
        setErrors({})
        setFuncionarioID('')
        setObraID('')
        setValueStatus('')
        setHoras({ chegada: '', almoco: '', retorno: '', saida: '' })
    }
    
    const updateHorario = async () => {
        const error = {}
        const payload = {
            data: data,
            chegada: horas.chegada,
            almoco: horas.almoco,
            retorno: horas.retorno,
            saida: horas.saida
        }
         
        console.log(payload)
        if (!Number.isInteger(funcionarioID)) {
            error.funcionario = 'Selecione um funcionário válido.'
        }

        if (!payload.data) {
            error.dataHorario = 'Informe uma data válida!'
        }

        if (!validarHora(payload.chegada)) {
            error.chegada = 'Hora de chegada inválida, use formato HH:MM:SS'
        }
        if (!validarHora(payload.almoco)) {
            error.almoco = 'Hora de almoço inválida, use formato HH:MM:SS'
        }
        if (!validarHora(payload.retorno)) {
            error.retorno = 'Hora de retorno inválida, use formato HH:MM:SS'
        }
        if (!validarHora(payload.saida)) {
            error.saida = 'Hora de saída inválida, use formato HH:MM:SS'
        }

        if (Object.keys(error).length > 0) {
            setErrors(error)
            return
        }


        await api.post(`/ponto/ajusteHorario/${pontoID}`,payload)
        alert('Atualizado com sucesso!')




    }

    const getHorario = async () => {
        const query = new URLSearchParams({
            data: data,
            funcionario: funcionarioID
        })
        const response = await api.get(`/ponto/getHorario?${query}`)

        if (response.status === 200) {
            setHoras(response.data)
            setPontoID(response.data.id)
        } else if (response.status === 203) {
            alert(
                `Foi encontrado um ponto com o status de ${response.data.status}, altere a data`
            )
            setHoras(response.data)
        } else {
            alert('Não foi encontrado nenhum ponto registrado nessa data')
            setHoras({ chegada: '', almoco: '', retorno: '', saida: '' })
        }
    }

    const salvarAjuste = async () => {
        const payload = {
            inicio,
            fim,
            valueStatus,
            funcionarioID,
            obraID,
            ...horas
        }
        const error = {}
        if (!inicio) error.inicio = 'Insira uma data válida.'
        if (!fim) error.fim = 'Insira uma data válida.'
        if (!valueStatus) error.status = 'Insira um ajuste válido.'
        if (!Number.isInteger(funcionarioID))
            error.funcionario = 'Selecione um funcionário válido.'
        if (!Number.isInteger(obraID)) error.obra = 'Selecione uma obra válida.'
        if (inicio > fim) error.data = 'Período inválido'

        if (Object.keys(error).length > 0) {
            setErrors(error)
            return
        }

        await api.post('/ponto/ajuste', payload)
        Swal.fire({
            title: 'Sucesso!',
            text: 'Dados atualizados!',
            icon: 'success',
            confirmButtonText: 'Ok'
        })

        setErrors({})
        setOpen(false)
    }

    useEffect(() => {
        api.get('/funcionarios/autocomplete').then(res =>
            setFuncionarios(res.data)
        )
        api.get('/ponto/autocomplete').then(res => setStatus(res.data))
    }, [])

    useEffect(() => {
        if (!funcionarioID) {
            setObras([])
            setObraID('')
            return
        }
        const obrasDisponiveis = async () => {
            try {
                const query = new URLSearchParams({
                    funcionario_id: funcionarioID
                })
                const response = await api.get(`/obras/getFuncionario?${query}`)
                setObras(response.data)
                setObraID('')
            } catch (err) {
                console.error('Erro ao buscar obras:', err)
                setObras([])
            }
        }
        obrasDisponiveis()
    }, [funcionarioID])

    return (
        <div>
            <Dialog
                open={open}
                onOpenChange={open => {
                    setOpen(open)
                    if (!open) resetForm()
                }}
            >
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className='w-full max-w-md md:max-w-3xl p-4 sm:p-6'>
                    <DialogHeader>
                        <DialogTitle>Ajustar Ponto</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Faça o ajuste de ponto.
                    </DialogDescription>

                    <div className='grid grid-cols-12 gap-2'>
                        <div
                            className={`${
                                valueStatus === 'Horário'
                                    ? 'col-span-12 md:col-span-5'
                                    : 'col-span-6 md:col-span-6'
                            }`}
                        >
                            <InputLabel>Funcionário</InputLabel>
                            <Autocomplete
                                className='w-full'
                                data={funcionarios}
                                value={funcionarioID}
                                suppressAutoFocus
                                onChange={setFuncionarioID}
                            />
                            <InputError
                                message={errors.funcionario}
                                className='mt-1'
                            />
                        </div>

                        {valueStatus !== 'Horário' && (
                            <>
                                <div className='col-span-6 md:col-span-6'>
                                    <InputLabel>Obra</InputLabel>
                                    <Autocomplete
                                        className='w-full'
                                        data={obras}
                                        value={obraID}
                                        onChange={setObraID}
                                    />
                                    <InputError
                                        message={errors.obra}
                                        className='mt-1'
                                    />
                                </div>
                                <div className='col-span-6 md:col-span-3'>
                                    <InputLabel>De</InputLabel>
                                    <TextInput
                                        type='date'
                                        className='w-full'
                                        value={inicio}
                                        onChange={e =>
                                            setInicio(e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.data}
                                        className='mt-1'
                                    />
                                    <InputError
                                        message={errors.inicio}
                                        className='mt-1'
                                    />
                                </div>
                                <div className='col-span-6 md:col-span-3'>
                                    <InputLabel>Até</InputLabel>
                                    <TextInput
                                        type='date'
                                        className='w-full'
                                        value={fim}
                                        onChange={e => setFim(e.target.value)}
                                    />
                                    <InputError
                                        message={errors.data}
                                        className='mt-1'
                                    />
                                    <InputError
                                        message={errors.fim}
                                        className='mt-1'
                                    />
                                </div>
                            </>
                        )}

                        {valueStatus === 'Horário' && (
                            <div className='col-span-7 md:col-span-4'>
                                <InputLabel>Data</InputLabel>
                                <div className='flex items-center gap-2'>
                                    <TextInput
                                        type='date'
                                        value={data}
                                        onChange={e => setData(e.target.value)}
                                        className='w-full'
                                    />
                                    <PrimaryButton
                                        type='button'
                                        onClick={getHorario}
                                        className='h-[42px] flex items-center justify-center'
                                    >
                                        <Search />
                                    </PrimaryButton>
                                </div>
                                <InputError
                                    message={errors.dataHorario}
                                    className='mt-1'
                                />
                            </div>
                        )}
                        <div
                            className={`${
                                valueStatus === 'Horário'
                                    ? 'col-span-5 md:col-span-3'
                                    : 'col-span-12 md:col-span-6'
                            }`}
                        >
                            <InputLabel>Ajuste</InputLabel>
                            <Autocomplete
                                data={status}
                                value={valueStatus}
                                suppressAutoFocus
                                onChange={setValueStatus}
                                className='w-full'
                            />
                            <InputError
                                message={errors.status}
                                className='mt-1'
                            />
                        </div>
                    </div>

                    {valueStatus === 'Horário' && (
                        <div className='grid grid-cols-12 gap-3 mt-3'>
                            <div className='col-span-3'>
                                <InputLabel>Chegada</InputLabel>
                                <TextInput
                                    className='w-full'
                                    name='chegada'
                                    value={horas.chegada}
                                    onChange={handleChangeHoras}
                                    maxLength={8} // HH:MM:SS
                                />
                                <InputError
                                    message={errors.chegada}
                                    className='mt-1'
                                />
                            </div>

                            <div className='col-span-3'>
                                <InputLabel>Almoço</InputLabel>
                                <TextInput
                                    className='w-full'
                                    name='almoco'
                                    value={horas.almoco}    
                                    onChange={handleChangeHoras}
                                    maxLength={8}
                                />
                                <InputError
                                    message={errors.almoco}
                                    className='mt-1'
                                />
                            </div>

                            <div className='col-span-3'>
                                <InputLabel>Retorno</InputLabel>
                                <TextInput
                                    className='w-full'
                                    name='retorno'
                                    value={horas.retorno}
                                    onChange={handleChangeHoras}
                                    maxLength={8}
                                />
                                <InputError
                                    message={errors.retorno}
                                    className='mt-1'
                                />
                            </div>

                            <div className='col-span-3'>
                                <InputLabel>Saída</InputLabel>
                                <TextInput
                                    className='w-full'
                                    name='saida'
                                    value={horas.saida}
                                    onChange={handleChangeHoras}
                                    maxLength={8}
                                />
                                <InputError
                                    message={errors.saida}
                                    className='mt-1'
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <div className='justify-end flex flex-row gap-4 mt-3'>
                            {valueStatus != 'Horário' && (
                                <PrimaryButton onClick={salvarAjuste}>
                                    <span className='hidden md:block'>
                                        Salvar
                                    </span>
                                    <span className='block md:hidden'>
                                        <Save />
                                    </span>
                                </PrimaryButton>
                            )}

                            {valueStatus === 'Horário' && (
                                <PrimaryButton onClick={updateHorario}>
                                    <span className='hidden md:block'>
                                        Salvar
                                    </span>
                                    <span className='block md:hidden'>
                                        <Save />
                                    </span>
                                </PrimaryButton>
                            )}

                            <DangerButton>
                                <span className='hidden md:block'>
                                    Cancelar
                                </span>
                                <span className='block md:hidden'>
                                    <Trash />
                                </span>
                            </DangerButton>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
