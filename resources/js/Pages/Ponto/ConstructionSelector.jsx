import api from '@/api'
import Autocomplete from '@/Components/Autocomplete'
import PrimaryButton from '@/Components/PrimaryButton'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/Components/ui/dialog'
import { router } from '@inertiajs/react'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'

export default function ConstructionSelector ({ children }) {
    const [open, setOpen] = useState(false)
    const [obras, setObras] = useState([])
    const [id, setId] = useState(0)

    useEffect(() => {
        api.get('/obras/autocomplete').then(res => {
            setObras(res.data)
        })
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent initialFocus={false}>
                <DialogHeader>
                    <DialogTitle>Ponto</DialogTitle>
                    <DialogDescription>
                        Escolha a obra para o ponto.
                    </DialogDescription>
                </DialogHeader>

                <div className='w-full'>
                    <Autocomplete
                        data={obras}
                        suppressAutoFocus={true}
                        onChange={(value, item) => {
                            setId(value)
                        }}
                    />
                </div>

                <DialogFooter>
                    <a href={route('ponto', id)} target='_blank'>
                        <PrimaryButton>Selecionar</PrimaryButton>
                    </a>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
