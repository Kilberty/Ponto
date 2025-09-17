import DangerButton from '@/Components/DangerButton'
import InputError from '@/Components/InputError'
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
import { router, useForm } from '@inertiajs/react'
import { Trash, Save } from 'lucide-react'
import { useState } from 'react'

export default function AddUser ({ children }) {
    const [errors,setErrors] = useState({})
    const [open,setOpen] = useState(false)
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmedPassword,setConfirmedPassword] = useState("")
    const form = useForm({
        name:'',
        email:'',
        password:'',
        confirmedPassword:'',
    })
    
    const handlechange = (e)=> {
        const {name,value} = e.target
        form.setData(prev => ({ ...prev, [name]: value }))
    }
    
    const criarUsuario = () =>{
      const data = form.data
      const error = {}
      if(!name){
        error.nome = 'Digite o nome do usuário.'
      }

      if(!email) {
        error.email = 'Digite o email do usuário.'
      }
      
      if(!password) {
        error.senha = 'Digite a senha do usuário.'
      }
      
      if(!confirmedPassword){
        error.confirmacao = "Digite a senha do usuário."
      }
    
      if(password != confirmedPassword){
        error.igual = "Senhas não são iguais."
      }
    

      if (Object.keys(error).length > 0) {
            setErrors(error)
            return
       }

       const payload = {name,email,password,confirmedPassword}
       router.post('/usuarios/add',payload,{
        onSuccess:()=>{
           Swal.fire({
                    title: 'Sucesso!',
                    text: 'usuário adicionado.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
            })
        
        }
       })
     
       setOpen(false)




    }
    
     return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Usuário</DialogTitle>
                    <DialogDescription>
                        Adicione os dados do usuário.
                    </DialogDescription>
                </DialogHeader>
                 
                 <div className='grid grid-cols-12 gap-2'>
                   <div className='col-span-6'>
                        <InputLabel>Nome</InputLabel>
                        <TextInput 
                        className='w-full' 
                        name='name'
                        value={name}
                        onChange={e=>setName(e.target.value)}
                        />
                        <InputError
                         message={errors.nome}
                         className=' mt-1'
                        />
                   </div>
                 
                  <div className='col-span-6' >
                       <InputLabel>Email</InputLabel>
                       <TextInput 
                       className='w-full'
                       name='email'
                       value={email}
                       onChange={e=>setEmail(e.target.value)}
                       />
                       <InputError
                        message={errors.email}
                        className='mt-1'
                       />
                  </div>
                 
                  <div className='col-span-6' >
                       <InputLabel>Senha</InputLabel>
                       <TextInput 
                       className='w-full' 
                       type='password' 
                       name='password'
                       value={password}
                       onChange={e=>setPassword(e.target.value)}
                       />
                       <InputError
                        message={errors.senha}
                        className=' mt-1'
                       />
                       <InputError
                       message={errors.igual}
                       className=' mt-1'
                       /> 
                  </div>
                  
                  <div className='col-span-6' >
                    <InputLabel>Confirme a Senha</InputLabel>
                    <TextInput 
                    className='w-full' 
                    type='password'
                    name='confirmedPassword'
                    value={confirmedPassword}
                    onChange={e=>setConfirmedPassword(e.target.value)} 
                    />
                    <InputError
                     message={errors.confirmacao}
                     className=' mt-1'
                    />
                    <InputError
                     message={errors.igual}
                     className=' mt-1'
                    />

                  </div>
                 
                 
                 </div> 





                <DialogFooter>
                    <div className='justify-end flex gap-2'>
                        <PrimaryButton
                         onClick={criarUsuario}
                        >
                            <Save />
                        </PrimaryButton>
                        <DangerButton>
                            <Trash />
                        </DangerButton>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
