import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import Autocomplete from "@/Components/Autocomplete";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Search, FileDown } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import api from "@/api";
import Pagination from "@/Components/Pagination";
import InputError from "@/Components/InputError";

export default function Individual() {
    const { funcionarios, inicio, fim } = usePage().props;

    const [filters, setFilters] = useState({
        funcionario: "",
        inicio: inicio,
        fim: fim,
    });
    const [errors, setErrors] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [results, setResults] = useState([]);
    const [links, setLinks] = useState([]);
    const [pdf, setPDF] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const fetchPDF = async () => {
        const query = new URLSearchParams({
            id: filters.funcionario,
            inicio: filters.inicio,
            fim: filters.fim,
        }).toString();

        window.open(`/relatorios/ponto/individual/pdf?${query}`, "_blank");
    };

    const fetchPontos = async (page = 1) => {
        const query = new URLSearchParams({
            id: filters.funcionario,
            inicio: filters.inicio,
            fim: filters.fim,
            page,
        });

        try {
            const response = await api.get(
                `/relatorios/ponto/individual/info?${query}`
            );
            const data = await response.data;
            setResults(data.pontos.data);
            setLinks(data.pontos.links);
            setShowTable(true);
            setErrors({});
        } catch (err) {
            console.error(err);
        }
    };

    const pesquisar = async () => {
        const error = {};

        if (!Number.isInteger(filters.funcionario)) {
            error.funcionario = "Selecione um funcionário válido";
        }
        if (!filters.inicio) {
            error.inicio = "Insira uma data válida.";
        }
        if (!filters.fim) {
            error.fim = "Insira uma data válida.";
        }
        if (filters.inicio > filters.fim) {
            error.data = "Período inválido";
        }

        if (Object.keys(error).length > 0) {
            setErrors(error);
            return;
        }

        setPDF(true);
        fetchPontos();
    };

    const handlePageChange = (page) => {
        fetchPontos(page);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Ponto
                </h2>
            }
        >
            <Head title="Relatório Individual" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-12 gap-4 mb-4 items-end">
                            {/* Funcionário */}
                            <div className="col-span-12 md:col-span-4 relative">
                                <InputLabel>Funcionário</InputLabel>
                                <Autocomplete
                                    name="funcionario"
                                    data={funcionarios}
                                    value={filters.funcionario}
                                    onChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            funcionario: value,
                                        }))
                                    }
                                />
                                <InputError
                                    message={errors.funcionario}
                                    className="absolute mt-1 mb-2"
                                />
                            </div>

                            {/* Início */}
                            <div className="col-span-6 md:col-span-3 relative">
                                <InputLabel>Início</InputLabel>
                                <TextInput
                                    type="date"
                                    name="inicio"
                                    className="w-full"
                                    value={filters.inicio}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.inicio || errors.data}
                                    className="absolute mt-1 mb-2"
                                />
                            </div>

                            {/* Fim */}
                            <div className="col-span-6 md:col-span-3 relative">
                                <InputLabel>Fim</InputLabel>
                                <TextInput
                                    type="date"
                                    name="fim"
                                    className="w-full"
                                    value={filters.fim}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.fim || errors.data}
                                    className="absolute mt-1 mb-2"
                                />
                            </div>

                            {/* Botões */}
                            <div className="col-span-12 md:col-span-2 flex gap-2 justify-end md:justify-start">
                                <PrimaryButton
                                    onClick={pesquisar}
                                    className="px-3 py-2 flex items-center"
                                >
                                    <Search />
                                </PrimaryButton>
                                {pdf && (
                                    <PrimaryButton
                                        onClick={fetchPDF}
                                        className="px-3 py-2 flex items-center"
                                    >
                                        <FileDown />
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>

                        {/* Tabela */}
                        {showTable && (
                            <div className="mt-6 overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Obra</TableHead>
                                            <TableHead>Chegada</TableHead>
                                            <TableHead>Almoço</TableHead>
                                            <TableHead>Retorno</TableHead>
                                            <TableHead>Saída</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((ponto) => (
                                            <TableRow key={ponto.dia}>
                                                <TableCell>
                                                    {ponto.dia}
                                                </TableCell>
                                                <TableCell>
                                                    {ponto.obra}
                                                </TableCell>
                                                <TableCell>
                                                    {ponto.chegada ??
                                                        ponto.status}
                                                </TableCell>
                                                <TableCell>
                                                    {ponto.almoco
                                                        ? ponto.almoco 
                                                        : ponto.chegada 
                                                        ? "-"
                                                        : ponto.status 
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {ponto.retorno 
                                                        ? ponto.retorno 
                                                        : ponto.chegada 
                                                        ? "-"
                                                        : ponto.status }
                                                </TableCell>
                                                <TableCell>
                                                    {ponto.saida 
                                                        ? ponto.saida 
                                                        : ponto.chegada 
                                                        ? "-"
                                                        : ponto.status }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Pagination
                                    links={links}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
