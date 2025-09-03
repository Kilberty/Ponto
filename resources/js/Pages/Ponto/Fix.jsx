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
import { Save, Trash } from 'lucide-react'
import api from '@/api'
import { useEffect, useState } from 'react'
import InputError from '@/Components/InputError'

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

    const resetForm = () => {
        setFuncionarioID('')
        setObraID('')
        setValueStatus('')
    }

    const salvarAjuste = async () => {
        const payload = { inicio, fim, valueStatus, funcionarioID, obraID }
        const error = {}
        if (!payload.inicio) {
            error.inicio = 'Insira uma data válida.'
        }
        if (!payload.fim) {
            error.fim = 'Insira uma data válida.'
        }
        if (!payload.valueStatus) {
            error.status = 'Insira um ajuste válido.'
        }

        if (!Number.isInteger(payload.funcionarioID)) {
            error.funcionario = 'Selecione um funcionário válido.'
        }
        if (!Number.isInteger(payload.obraID)) {
            error.obra = 'Selecione uma obra válida.'
        }

        if (payload.inicio > payload.fim) {
            error.data = 'Período inválido'
        }

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

        setOpen(false)
    }

    // Busca funcionários e status apenas na montagem do componente
    useEffect(() => {
        api.get('/funcionarios/autocomplete').then(res =>
            setFuncionarios(res.data)
        )
        api.get('/ponto/autocomplete').then(res => setStatus(res.data))
    }, [])

    // Busca obras sempre que o funcionário mudar
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
                setObraID('') // limpa seleção anterior
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
                    if (!open) {
                        resetForm()
                    }
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
                        <div className='col-span-6 md:col-span-6'>
                            <InputLabel>Funcionário</InputLabel>
                            <Autocomplete
                                className='w-full'
                                data={funcionarios}
                                value={funcionarioID}
                                suppressAutoFocus={true}
                                onChange={value => setFuncionarioID(value)}
                            />
                            <InputError
                                message={errors.funcionario}
                                className='mt-1'
                            />
                        </div>

                        <div className='col-span-6 md:col-span-6'>
                            <InputLabel>Obra</InputLabel>
                            <Autocomplete
                                className='w-full'
                                data={obras}
                                value={obraID}
                                onChange={value => setObraID(value)}
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
                                onChange={e => setInicio(e.target.value)}
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
                            <InputError message={errors.fim} className='mt-1' />
                        </div>

                        <div className='col-span-12 md:col-span-6'>
                            <InputLabel>Ajuste</InputLabel>
                            <Autocomplete
                                data={status}
                                value={valueStatus}
                                suppressAutoFocus={true}
                                onChange={value => setValueStatus(value)}
                            />
                            <InputError
                                message={errors.status}
                                className='mt-1'
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <div className='justify-end flex flex-row gap-4 mt-3'>
                            <PrimaryButton onClick={salvarAjuste}>
                                <span className='hidden md:block'>Salvar</span>
                                <span className='block md:hidden'>
                                    <Save />
                                </span>
                            </PrimaryButton>
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
