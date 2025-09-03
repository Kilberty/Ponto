import { Head, useForm } from "@inertiajs/react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from '@/Components/ui/dialog'
import PrimaryButton from "@/Components/PrimaryButton"
import DangerButton from "@/Components/DangerButton"
import { Save, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import TextArea from "@/Components/TextArea"
import api from "@/api"






export default function AddDescription({children,id}){
    const [open,setOpen] = useState(false)
    
    const form = useForm({
        descricao:'',
    })

    useEffect(()=>{
       api.get(`/obras/${id}/descricao`).then(res=>{
         form.setData('descricao',res.data.descricao)
       })
    },[id,open])
    
    
    const salvar = ()=>{
        form.patch(`/obras/${id}/descricao`,{
            onSuccess:()=>{
                setOpen(false)
                window.Swal.fire({
                    title: 'Sucesso!',
                    text: 'Descrição atualizada!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                })
            }
        })
    }


    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                 {children}
            </DialogTrigger>
            
            
            <DialogContent className="w-full max-w-md md:max-w-3xl">
               <DialogHeader>
                  <DialogTitle>Descrição</DialogTitle>
                  <DialogDescription>Descrição da obra.</DialogDescription>
               </DialogHeader>
            
               <TextArea
               className='h-[30vh] md:h-[50vh]'
               value={form.data.descricao} 
               onChange = {(e)=>{
                    const value = e.target.value
                    form.setData('descricao',value)
                }}
               />
            
             <DialogFooter>
                <div className="flex flex-row gap-4 mt-4 justify-end " >
                     <PrimaryButton onClick={salvar}>
                      <span className="hidden md:block" >Salvar</span>
                      <span className="md:hidden"><Save/></span>
                     </PrimaryButton>
                     <DangerButton>
                        <span className="hidden md:block" >Cancelar</span>
                        <span className="md:hidden"><Trash/></span>
                     </DangerButton>
                </div>
             </DialogFooter>
            
            </DialogContent>    
        </Dialog>
    )
}