import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import TextInput from '@/Components/TextInput';
import api from '@/api';
// Certifique-se de ter a importação do SweetAlert2 aqui, por exemplo:
// import Swal from 'sweetalert2';

export default function Ponto() {
    const { obra } = usePage().props;
    const inputRef = useRef(null);
    const [codigo, setCodigo] = useState('');
    const [processing, setProcessing] = useState(false);

    const baterPonto = async e => {
        e.preventDefault();
        setProcessing(true);

        const payload = {
            codigo: codigo,
            obra_id: obra.id
        };

        try {
            const response = await api.post('/ponto/add', payload);
            const data = response.data;

            Swal.fire({
                title: 'Ponto Batido com Sucesso!',
                html: `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; margin-top: 15px;">
                        <div>
                            <strong>Nome do Funcionário:</strong><br>
                            ${data.nome}
                        </div>
                        <div>
                            <strong>Data:</strong><br>
                            ${data.data}
                        </div>
                        <div>
                            <strong>Obra:</strong><br>
                            ${obra.nome}
                        </div>
                        <div>
                            <strong>Hora:</strong><br>
                            ${data.hora}
                        </div>
                    </div>
                `,
                icon: 'success',
                showConfirmButton: true, // Oculta o botão 'OK'
                timer: 5000, // Fecha o alerta após 5 segundos (5000 milissegundos)
                willClose: () => {
                    setCodigo('');
                    inputRef.current?.focus();
                },
            });
        } catch (error) {
            // Este bloco captura erros da requisição, como 403, 404, etc.
            const statusCode = error.response?.status;
            const errorMessage =
                error.response?.data?.message ||
                'Ocorreu um erro. Tente novamente.';

            Swal.fire({
                title: 'Erro!',
                text: statusCode === 403 ? 'Todos os pontos do dia foram batidos.' : errorMessage,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            console.error('Erro na requisição:', error.response);
        } finally {
            setProcessing(false);
        }
    };

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

                        <PrimaryButton
                            className='w-full justify-center'
                            disabled={processing}
                        >
                            Bater Ponto
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}