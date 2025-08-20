import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from "react";

export default function Business() {
    const { empresa } = usePage().props;

    const [editar, setEditar] = useState(false);
    const form = useForm({ ...empresa });

    const handleChange = (e) => {
        const { name, value } = e.target;
        form.setData(prev => ({ ...prev, [name]: value }));
    };

    const update = () => {
        form.post('/empresa/update', {
            onSuccess: () => setEditar(false),
            onError: () => console.log(form.errors),
        });
    };

    const cancelar = () => {
        form.setData(empresa)
        setEditar(false);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Empresa</h2>}
        >
            <Head title="Empresa" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg py-10 px-8 flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 flex-1">
                            <div className="md:col-span-4">
                                <InputLabel>Nome Fantasia:</InputLabel>
                                <TextInput className="w-full" name="nome_fantasia" value={form.data.nome_fantasia} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-5">
                                <InputLabel>Razão Social:</InputLabel>
                                <TextInput className="w-full" name="razao_social" value={form.data.razao_social} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-3">
                                <InputLabel>CNPJ:</InputLabel>
                                <TextInput className="w-full" name="cnpj" value={form.data.cnpj} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel>CEP:</InputLabel>
                                <TextInput className="w-full" name="cep" value={form.data.cep} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-8">
                                <InputLabel>Endereço:</InputLabel>
                                <TextInput className="w-full" name="rua" value={form.data.rua} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel>Número:</InputLabel>
                                <TextInput className="w-full" name="numero" value={form.data.numero} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-1">
                                <InputLabel>UF:</InputLabel>
                                <TextInput className="w-full" name="uf" value={form.data.uf} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-7">
                                <InputLabel>Cidade:</InputLabel>
                                <TextInput className="w-full" name="cidade" value={form.data.cidade} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-4">
                                <InputLabel>Bairro:</InputLabel>
                                <TextInput className="w-full" name="bairro" value={form.data.bairro} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-3">
                                <InputLabel>Telefone 1:</InputLabel>
                                <TextInput className="w-full" name="telefone_1" value={form.data.telefone_1} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-3">
                                <InputLabel>Telefone 2:</InputLabel>
                                <TextInput className="w-full" name="telefone_2" value={form.data.telefone_2} onChange={handleChange} disabled={!editar} />
                            </div>

                            <div className="md:col-span-6">
                                <InputLabel>Email:</InputLabel>
                                <TextInput className="w-full" name="email" value={form.data.email} onChange={handleChange} disabled={!editar} />
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            {editar ? (
                                <>
                                    <PrimaryButton onClick={update}>Salvar</PrimaryButton>
                                    <DangerButton className="ml-3" onClick={cancelar}>Cancelar</DangerButton>
                                </>
                            ) : (
                                <PrimaryButton className="ml-3" onClick={() => setEditar(true)}>Editar</PrimaryButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
