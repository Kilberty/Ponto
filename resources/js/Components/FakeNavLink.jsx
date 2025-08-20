import { cn } from '@/lib/utils' // ou use clsx se preferir

export default function FakeNavLink({ active = false, className = '', children, ...props }) {
    return (
        <button
            type="button"
            {...props}
            className={cn(
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                active
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700',
                className
            )}
        >
            {children}
        </button>
    )
}
