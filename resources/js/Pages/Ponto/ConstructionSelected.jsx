import GuestLayout from '@/Layouts/GuestLayout'
import PrimaryButton from '@/Components/PrimaryButton'
import { usePage } from '@inertiajs/react'
import { useRef, useState } from 'react'
import TextInput from '@/Components/TextInput'
import api from '@/api'

export default function Ponto() {
    const { obra } = usePage().props
    const inputRef = useRef(null)
    const [codigo, setCodigo] = useState('')
    const [processing, setProcessing] = useState(false)

    const baterPonto = async e => {
        e.preventDefault()
        setProcessing(true)

        const payload = {
            codigo: codigo,
            obra_id: obra.id
        }

        try {
            const response = await api.post('/ponto/add', payload)
            const data = response.data

            // Esta parte só será executada se a resposta for bem-sucedida (status 2xx)
            alert(`Ponto batido com sucesso!\nFuncionário: ${data.nome}\nHora: ${data.hora}`)

        } catch (error) {
            // Este bloco captura erros da requisição, como 403, 404, etc.
            const statusCode = error.response?.status
            const errorMessage = error.response?.data?.message || 'Ocorreu um erro. Tente novamente.'

            if (statusCode === 403) {
                alert('Todos os pontos do dia foram batidos.')
            } else {
                alert(errorMessage)
            }
            console.error('Erro na requisição:', error.response)
        } finally {
            // Este bloco sempre será executado, independentemente do sucesso ou erro
            setCodigo('')
            inputRef.current?.focus()
            setProcessing(false)
        }
    }

    return (
        <GuestLayout>
            <div className='p-6 text-gray-900'>
                <div className='flex flex-col items-center space-y-4'>
                    <p className='text-gray-700 font-bold text-center'>
                        Obra: {obra.nome}
                    </p>

                    <form
                        className='w-full max-w-sm flex flex-col items-center space-y-4'
                        onSubmit={baterPonto}
                    >
                        <TextInput
                            type='text'
                            placeholder='Código'
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                            ref={inputRef}
                            autoFocus
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                        />

                        <PrimaryButton className='w-full justify-center' disabled={processing}>
                            Bater Ponto
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </GuestLayout>
    )
}