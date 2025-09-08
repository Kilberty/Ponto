import ApplicationLogo from '@/Components/ApplicationLogo'
import Dropdown from '@/Components/Dropdown'
import FakeNavLink from '@/Components/FakeNavLink'
import NavLink from '@/Components/NavLink'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
import ConstructionSelector from '@/Pages/Ponto/ConstructionSelector'
import Fix from '@/Pages/Ponto/Fix'
import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)
    const [openCadastros, setOpenCadastros] = useState(false)
    const [openPonto, setOpenPonto] = useState(false)

    const cadastrosAtivos =
        route().current('funcionarios') || route().current('funcoes')

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/home">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>

                            {/* Navegação Desktop */}
                            <div className="hidden sm:flex sm:ms-10 space-x-8">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Home
                                </NavLink>

                                <NavLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setOpenCadastros(!openCadastros)
                                        setOpenPonto(false)
                                    }}
                                    active={cadastrosAtivos}
                                >
                                    Cadastros
                                </NavLink>

                                <NavLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setOpenPonto(!openPonto)
                                        setOpenCadastros(false)
                                    }}
                                >
                                    Ponto
                                </NavLink>

                                <NavLink
                                    href="/empresa"
                                    active={route().current('empresa')}
                                >
                                    Empresa
                                </NavLink>
                                <NavLink href="/relatorios">Relatórios</NavLink>
                            </div>
                        </div>

                        {/* Desktop: Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile: User Dropdown + Hamburger */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((prev) => !prev)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu Mobile Dropdown */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('home')}
                            active={route().current('home')}
                        >
                            Home
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                setOpenCadastros(!openCadastros)
                            }}
                            active={cadastrosAtivos}
                        >
                            Cadastros
                        </ResponsiveNavLink>
                        {openCadastros && (
                            <div className="sm:hidden bg-white px-4 py-2 space-y-1">
                                <ResponsiveNavLink href="/usuarios">
                                    Usuários
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href="/funcoes"
                                    active={route().current('funcoes')}
                                >
                                    Funções
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href="/funcionarios"
                                    active={route().current('funcionarios')}
                                >
                                    Funcionários
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="/obras">
                                    Obras
                                </ResponsiveNavLink>
                            </div>
                        )}

                        <ResponsiveNavLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                setOpenPonto(!openPonto)
                            }}
                        >
                            Ponto
                        </ResponsiveNavLink>
                        {openPonto && (
                            <div className="sm:hidden bg-white px-4 py-2 space-y-1">
                                <Fix>
                                    <FakeNavLink>Ajustar ponto</FakeNavLink>
                                </Fix>
                            </div>
                        )}

                        <ResponsiveNavLink
                            href={route('empresa')}
                            active={route().current('empresa')}
                        >
                            Empresa
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href="/relatorios">
                            Relatórios
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {/* Submenu Desktop Cadastros */}
            {openCadastros && (
                <div className="hidden sm:block border-b bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex space-x-4">
                        <NavLink href="/usuarios">Usuários</NavLink>
                        <NavLink
                            href="/funcoes"
                            active={route().current('funcoes')}
                        >
                            Funções
                        </NavLink>
                        <NavLink
                            href="/funcionarios"
                            active={route().current('funcionarios')}
                        >
                            Funcionários
                        </NavLink>
                        <NavLink href="/obras">Obras</NavLink>
                    </div>
                </div>
            )}

            {/* Submenu Desktop Ponto */}
            {openPonto && (
                <div className="hidden sm:block border-b bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex space-x-4">
                        <ConstructionSelector>
                            <FakeNavLink>Selecionar obra</FakeNavLink>
                        </ConstructionSelector>
                        <Fix>
                            <FakeNavLink>Ajustar ponto</FakeNavLink>
                        </Fix>
                    </div>
                </div>
            )}

            {/* Cabeçalho */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Conteúdo principal */}
            <main>{children}</main>
        </div>
    )
}
