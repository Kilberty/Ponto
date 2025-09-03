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
import { useForm } from '@inertiajs/react'
import { Save, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '@/api'
import { consultarCep } from '@/utils' // <-- IMPORTANTE
import mask from '@/mask'

export default function AddConstruction({ children }) {
    const form = useForm({
        nome: '',
        cep: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
    })

    const [ufs, setUfs] = useState([])
    const [errors,setErrors] = useState({})
    const [open,setOpen] = useState(false)
    useEffect(() => {
        api.get('/ufs').then(res => {
            setUfs(res.data)
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        form.setData(prev => ({
            ...prev,
            [name]: value
        }))
    }
   
    const salvar = ()=>{
        const error = {}
        
        if(!form.data.nome){
          error.nome = 'Nome da obra é obrigatório.'
        }
    
        if (Object.keys(error).length > 0) {
            setErrors(error)
            return
        }
    
        form.post('/obras/add',{
            onSuccess:()=>{
              setOpen(false)
              window.Swal.fire({
                    title: 'Sucesso!',
                    text: 'Obra adicionada!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                })
            }
        })
    
    }








    const buscarCep = async () => {
        const data = await consultarCep(form.data.cep, ufs)
        if (data) {
            form.setData(prev => ({ ...prev, ...data }))
        }
    }





    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="w-full max-w-md md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Obra</DialogTitle>
                    <DialogDescription>
                        Adicione as informações da obra.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12">
                        <InputLabel>Nome</InputLabel>
                        <TextInput
                            className="w-full"
                            name="nome"
                            onChange={handleChange}
                            value={form.data.nome}
                        />
                    </div>

                    <div className="col-span-6 md:col-span-3">
                        <InputLabel>CEP</InputLabel>
                        <div className="flex gap-2">
                            <TextInput
                                className="w-full"
                                name="cep"
                                onChange={(e)=>{
                                    const value = mask.unmask(e.target.value)
                                    form.setData("cep",value)
                                }}
                                value={mask.cep(form.data.cep)}
                            />
                            <PrimaryButton className="px-3 py-2" onClick={buscarCep}>
                                <Search size={18} />
                            </PrimaryButton>
                        </div>
                    </div>

                    <div className="hidden sm:block md:col-span-7">
                        <InputLabel>Endereço</InputLabel>
                        <TextInput
                            className="w-full"
                            name="endereco"
                            onChange={handleChange}
                            value={form.data.endereco}
                        />
                    </div>

                    <div className="hidden sm:block md:col-span-2">
                        <InputLabel>Número</InputLabel>
                        <TextInput
                            className="w-full"
                            name="numero"
                            onChange={handleChange}
                            value={form.data.numero}
                        />
                    </div>

                    <div className="col-span-6 md:col-span-4">
                        <InputLabel>Bairro</InputLabel>
                        <TextInput
                            className="w-full"
                            name="bairro"
                            onChange={handleChange}
                            value={form.data.bairro}
                        />
                    </div>

                    <div className="col-span-9 md:col-span-6">
                        <InputLabel>Município</InputLabel>
                        <TextInput
                            className="w-full"
                            name="cidade"
                            onChange={handleChange}
                            value={form.data.cidade}
                        />
                    </div>

                    <div className="col-span-3 md:col-span-2">
                        <InputLabel>UF</InputLabel>
                        <Autocomplete
                            data={ufs}
                            value={form.data.uf}
                            onChange={(value, item) => {
                                form.setData('uf', value || '')
                            }}
                        />
                    </div>

                    <div className="col-span-9 md:hidden">
                        <InputLabel>Endereço</InputLabel>
                        <TextInput
                            className="w-full"
                            name="endereco"
                            onChange={handleChange}
                            value={form.data.endereco}
                        />
                    </div>

                    <div className="col-span-3 md:hidden">
                        <InputLabel>Número</InputLabel>
                        <TextInput
                            className="w-full"
                            name="numero"
                            onChange={handleChange}
                            value={form.data.numero}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex flex-row gap-4 mt-4 justify-end">
                        <PrimaryButton onClick={salvar}>
                            <span className='md:hidden'><Save /></span>
                            <span className='hidden md:block'>Salvar</span>
                        </PrimaryButton>
                        <DangerButton>
                            <span className='md:hidden'><Trash /></span>
                            <span className='hidden md:block'>Cancelar</span>
                        </DangerButton>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
