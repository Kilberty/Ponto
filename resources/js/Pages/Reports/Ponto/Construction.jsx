import api from '@/api'
import Autocomplete from '@/Components/Autocomplete'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/Components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import InputError from '@/Components/InputError'

export default function Construction ({ children }) {
    const hoje = new Date().toISOString().split('T')[0]
    const [open, setOpen] = useState(false)
    const [obras, setObras] = useState([])
    const [id, setId] = useState('')
    const [nomeObra, setNomeObra] = useState('')
    const [inicio, setInicio] = useState(hoje)
    const [fim, setFim] = useState(hoje)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        api.get('/obras/autocomplete').then(res => {
            setObras(res.data)
        })
    }, [])

    const gerarRelatorio = async () => {
        const error = {}

        if (!Number.isInteger(id)) {
            error.obra = 'Selecione uma obra válida.'
        }
        if (!inicio) {
            error.inicio = 'Insira uma data válida.'
        }
        if (!fim) {
            error.fim = 'Insira uma data válida.'
        }
        if (inicio > fim) {
            error.data = 'Período inválido.'
        }

        if (Object.keys(error).length > 0) {
            setErrors(error)
            return
        }
        const dataInicio = new Date(inicio)
        const dataFim = new Date(fim)

        const formatador = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })

        
        const inicioFormatado = formatador.format(dataInicio)
        const fimFormatado = formatador.format(dataFim)
        
        
        
        
        
        
        
        const query = new URLSearchParams({
            obra: id,
            inicio: inicio,
            fim: fim
        }).toString()

        const response = await api.get(`/relatorios/ponto/obra/pdf?${query}`, {
            responseType: 'blob'
        })

        // cria um link temporário e dispara o download
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${nomeObra}_${inicioFormatado}---${fimFormatado}.zip`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={open => {
                setOpen(open) // A correção está aqui
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className='w-full max-w-md md:max-w-3xl'>
                <DialogHeader>
                    <DialogTitle>Ponto</DialogTitle>
                    <DialogDescription>Escolha a obra.</DialogDescription>
                </DialogHeader>

                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-12 md:col-span-6'>
                        <InputLabel>Obra</InputLabel>
                        <Autocomplete
                            data={obras}
                            className='w-full'
                            suppressAutoFocus={true}
                            onChange={(value, item) => {
                                setId(value)
                                setNomeObra(item.label)
                            }}
                        />
                        <InputError
                            message={errors.obra}
                            className='absolute mt-1'
                        />
                    </div>

                    <div className='col-span-6  md:col-span-3'>
                        <InputLabel>De</InputLabel>
                        <TextInput
                            className='w-full'
                            type='date'
                            value={inicio}
                            onChange={e => {
                                setInicio(e.target.value)
                            }}
                        />
                        <InputError
                            message={errors.inicio || errors.data}
                            className='absolute mt-1 mb-2'
                        />
                    </div>

                    <div className='col-span-6 md:col-span-3'>
                        <InputLabel>Até</InputLabel>
                        <TextInput
                            className='w-full'
                            type='date'
                            value={fim}
                            onChange={e => {
                                setFim(e.target.value)
                            }}
                        />
                        <InputError
                            message={errors.fim || errors.data}
                            className='absolute mt-1 mb-2'
                        />
                    </div>
                </div>

                <DialogFooter>
                    <div className='flex justify-end mt-2'>
                        <PrimaryButton
                            onClick={() => {
                                gerarRelatorio()
                            }}
                        >
                            Selecionar
                        </PrimaryButton>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
