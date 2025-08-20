import api from '@/api'
import Autocomplete from '@/Components/Autocomplete'
import Dropdown from '@/Components/Dropdown'
import PrimaryButton from '@/Components/PrimaryButton'
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


export default function ConstructionSelector({children}){
    
    const [open,setOpen] = useState(false)
    const [obras,setObras] = useState([])
    
    useEffect(()=>{
        api.get('/obras/autocomplete').then(res=>{
            setObras(res.data)
        })






    },[])
    
    
    
    return(
       <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild> 
             {children}
         </DialogTrigger>
         
         <DialogContent initialFocus = {false} >
            <DialogHeader>
                <DialogTitle>Ponto</DialogTitle>
                <DialogDescription>Escolha a obra para o ponto.</DialogDescription>
            </DialogHeader>
      
            <div className='w-full'>
              <Autocomplete
               data={obras}
               suppressAutoFocus={true}
              />
            </div>
         
            <DialogFooter>
                <PrimaryButton>Selecionar</PrimaryButton>
            </DialogFooter>
         
         
         
         
         </DialogContent>
       </Dialog>
    )
}